/**
 * ClinicFlow - Google Apps Script backend
 * Version: 2.0.0
 *
 * Public booking MVP:
 *   GET  ?action=health
 *   GET  ?action=doctors
 *   GET  ?action=slots&doctorId=DOC-001&date=YYYY-MM-DD
 *   POST {action:"bookAppointment", data:{...}}
 *   POST {action:"receptionLookup", data:{appointmentId:"..."}}
 *   POST {action:"updateAppointmentStatus", data:{appointmentId:"...",status:"..."}}
 *
 * IMPORTANT:
 * The public GitHub Pages frontend must never contain secrets.
 * Reception lookup/status endpoints expose patient data and are DEMO ONLY
 * until authentication/authorization is added.
 */

const CF = {
  clinicName: 'ClinicFlow',
  version: '2.0.0',
  timezone: 'Africa/Khartoum',
  spreadsheetName: 'ClinicFlow Database',
  sheets: {
    patients: 'Patients',
    appointments: 'Appointments',
    doctors: 'Doctors',
    payments: 'Payments',
    audit: 'AuditLog',
    settings: 'Settings',
    notifications: 'Notifications'
  }
};

const HEADERS = {
  Patients: ['Patient ID','Name','Phone','Email','Created At','Updated At'],
  Appointments: ['Appointment ID','Patient ID','Patient Name','Phone','Email','Doctor ID','Doctor Name','Specialty','Date','Time','Reason','Status','Created At','Updated At'],
  Doctors: ['Doctor ID','Name','Specialty','Duration','Working Days','Start Time','End Time','Active'],
  Payments: ['Receipt No','Appointment ID','Patient ID','Amount','Currency','Method','Status','Created At'],
  AuditLog: ['Timestamp','Action','Actor','Record ID','Details'],
  Settings: ['Key','Value','Updated At'],
  Notifications: ['Timestamp','Type','Recipient','Subject','Status','Record ID','Details']
};

const DEFAULT_DOCTORS = [
  ['DOC-001','Dr. Sara Ahmed','General Medicine',30,'1,2,3,4,5','09:00','15:00',true],
  ['DOC-002','Dr. Mohamed Ali','Dermatology',30,'0,2,4','10:00','17:00',true],
  ['DOC-003','Dr. Huda Osman','Dental',45,'1,3,5','09:00','13:00',true]
];

const ALLOWED_STATUSES = ['confirmed','checked_in','in_consultation','completed','cancelled'];

function setupClinicFlow() {
  const ss = getOrCreateSpreadsheet_();

  Object.keys(HEADERS).forEach(function(name) {
    ensureSheet_(ss, name, HEADERS[name]);
  });

  repairHeaders_(ss);
  seedDoctors_(ss);
  saveSetting_(ss, 'VERSION', CF.version);
  saveSetting_(ss, 'TIMEZONE', CF.timezone);

  const result = {
    success: true,
    message: 'ClinicFlow database is ready.',
    spreadsheetId: ss.getId(),
    spreadsheetUrl: ss.getUrl(),
    sheets: Object.keys(HEADERS).map(function(k) { return HEADERS[k] ? k : ''; })
  };

  Logger.log(JSON.stringify(result));
  return result;
}

/**
 * Run this once if you want email notifications for every new booking.
 * Example:
 *   configureClinicFlow('your-email@example.com')
 *
 * The email is stored in Apps Script Script Properties, not GitHub.
 */
function configureClinicFlow(notificationEmail) {
  const email = clean_(notificationEmail, 200);
  if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    throw Error('Please provide a valid notification email.');
  }

  PropertiesService.getScriptProperties().setProperty('CLINICFLOW_NOTIFICATION_EMAIL', email);
  setupClinicFlow();

  return {
    success: true,
    notificationEmail: email,
    message: 'ClinicFlow notification email configured.'
  };
}

function doGet(e) {
  const requestId = makeRequestId_();

  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || 'health').trim();

    if (action === 'health') {
      return json_({
        success: true,
        requestId: requestId,
        service: CF.clinicName,
        version: CF.version,
        database: databaseReady_()
      });
    }

    if (action === 'doctors') {
      const doctors = getDoctors_();
      return json_({
        success: true,
        requestId: requestId,
        doctors: doctors,
        count: doctors.length
      });
    }

    if (action === 'slots') {
      const doctorId = clean_(params.doctorId, 100);
      const date = clean_(params.date, 20);

      if (!doctorId || !/^\\d{4}-\\d{2}-\\d{2}$/.test(date)) {
        return json_({
          success: false,
          requestId: requestId,
          error: 'doctorId and a valid date (YYYY-MM-DD) are required.'
        });
      }

      return json_({
        success: true,
        requestId: requestId,
        doctorId: doctorId,
        date: date,
        slots: getAvailableSlots_(doctorId, date)
      });
    }

    return json_({
      success: false,
      requestId: requestId,
      error: 'Unknown action: ' + action
    });
  } catch (err) {
    logError_(requestId, 'GET', err);
    return json_({
      success: false,
      requestId: requestId,
      error: friendlyError_(err)
    });
  }
}

function doPost(e) {
  const requestId = makeRequestId_();

  try {
    const body = parseBody_(e);
    const action = String(body.action || '').trim();
    const data = body.data || {};

    if (action === 'bookAppointment') {
      return json_(withRequestId_(bookAppointment_(data), requestId));
    }

    if (action === 'receptionLookup') {
      return json_(withRequestId_(receptionLookup_(data), requestId));
    }

    if (action === 'updateAppointmentStatus') {
      return json_(withRequestId_(updateAppointmentStatus_(data), requestId));
    }

    return json_({
      success: false,
      requestId: requestId,
      error: 'Unknown action: ' + action
    });
  } catch (err) {
    logError_(requestId, 'POST', err);
    return json_({
      success: false,
      requestId: requestId,
      error: friendlyError_(err)
    });
  }
}

function bookAppointment_(data) {
  const name = clean_(data.name, 150);
  const phone = clean_(data.phone, 50);
  const email = clean_(data.email, 200);
  const doctorId = clean_(data.doctorId, 100);
  const date = clean_(data.date, 20);
  const time = clean_(data.time, 10);
  const reason = clean_(data.reason || 'Consultation', 500);

  if (!name || !phone || !doctorId || !date || !time) {
    throw Error('Name, phone, doctor, date and time are required.');
  }

  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(date)) {
    throw Error('Invalid appointment date.');
  }

  if (!/^\\d{2}:\\d{2}$/.test(time)) {
    throw Error('Invalid appointment time.');
  }

  const doctor = getDoctors_().find(function(x) {
    return x.id === doctorId && x.active;
  });

  if (!doctor) {
    throw Error('Doctor not found or inactive.');
  }

  const day = new Date(date + 'T12:00:00').getDay();

  if (!doctor.days.includes(day)) {
    throw Error('Doctor does not work on this day.');
  }

  if (!doctor.slots.includes(time)) {
    throw Error('Invalid time slot for this doctor.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const ss = getDb_();
    const appointmentsSheet = getRequiredSheet_(ss, CF.sheets.appointments);

    const rows = getDataRows_(appointmentsSheet);
    const indexes = headerIndexes_(appointmentsSheet);

    const alreadyBooked = rows.some(function(row) {
      return String(row[indexes['Doctor ID']] || '') === doctor.id &&
             formatDate_(row[indexes['Date']]) === date &&
             normalizeTime_(row[indexes['Time']]) === time &&
             String(row[indexes['Status']] || '').toLowerCase() !== 'cancelled';
    });

    if (alreadyBooked) {
      throw Error('That appointment slot is already booked.');
    }

    const now = new Date();
    const patient = findOrCreatePatient_(name, phone, email, now);
    const appointmentId = nextId_('APT');

    appointmentsSheet.appendRow([
      appointmentId,
      patient.id,
      name,
      phone,
      email,
      doctor.id,
      doctor.name,
      doctor.specialty,
      date,
      time,
      reason,
      'confirmed',
      now,
      now
    ]);

    audit_(
      'BOOK_APPOINTMENT',
      appointmentId,
      JSON.stringify({
        patientId: patient.id,
        doctorId: doctor.id,
        date: date,
        time: time
      })
    );

    // Notification failure must never cancel a successful booking.
    notifyNewAppointment_({
      appointmentId: appointmentId,
      patientId: patient.id,
      patientName: name,
      phone: phone,
      email: email,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: date,
      time: time,
      reason: reason
    });

    return {
      success: true,
      appointmentId: appointmentId,
      patientId: patient.id,
      patient: name,
      doctor: doctor.name,
      specialty: doctor.specialty,
      date: date,
      time: time,
      reason: reason,
      status: 'confirmed'
    };
  } finally {
    lock.releaseLock();
  }
}

function getDoctors_() {
  const sheet = getRequiredSheet_(getDb_(), CF.sheets.doctors);
  const rows = getDataRows_(sheet);
  const idx = headerIndexes_(sheet);

  return rows
    .filter(function(row) {
      return String(row[idx['Doctor ID']] || '').trim();
    })
    .map(function(row) {
      const start = normalizeTime_(row[idx['Start Time']]) || '09:00';
      const end = normalizeTime_(row[idx['End Time']]) || '17:00';
      const duration = Math.max(5, Number(row[idx['Duration']]) || 30);
      const days = parseWorkingDays_(row[idx['Working Days']]);
      const active = parseBoolean_(row[idx['Active']], true);

      return {
        id: String(row[idx['Doctor ID']] || '').trim(),
        name: String(row[idx['Name']] || '').trim(),
        specialty: String(row[idx['Specialty']] || '').trim(),
        duration: duration,
        days: days,
        start: start,
        end: end,
        active: active,
        slots: buildSlots_(start, end, duration)
      };
    });
}

function getAvailableSlots_(doctorId, date) {
  const doctor = getDoctors_().find(function(x) {
    return x.id === doctorId && x.active;
  });

  if (!doctor) {
    throw Error('Doctor not found or inactive.');
  }

  const day = new Date(date + 'T12:00:00').getDay();

  if (!doctor.days.includes(day)) {
    return doctor.slots.map(function(time) {
      return { time: time, available: false };
    });
  }

  const sheet = getRequiredSheet_(getDb_(), CF.sheets.appointments);
  const rows = getDataRows_(sheet);
  const idx = headerIndexes_(sheet);
  const booked = {};

  rows.forEach(function(row) {
    if (
      String(row[idx['Doctor ID']] || '') === doctorId &&
      formatDate_(row[idx['Date']]) === date &&
      String(row[idx['Status']] || '').toLowerCase() !== 'cancelled'
    ) {
      booked[normalizeTime_(row[idx['Time']])] = true;
    }
  });

  return doctor.slots.map(function(time) {
    return {
      time: time,
      available: !booked[time]
    };
  });
}

function receptionLookup_(data) {
  const appointmentId = clean_(data.appointmentId, 100);

  if (!appointmentId) {
    throw Error('Appointment number is required.');
  }

  const sheet = getRequiredSheet_(getDb_(), CF.sheets.appointments);
  const rows = getDataRows_(sheet);
  const idx = headerIndexes_(sheet);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (String(row[idx['Appointment ID']] || '').trim() === appointmentId) {
      return {
        success: true,
        appointment: {
          appointmentId: appointmentId,
          patientId: String(row[idx['Patient ID']] || ''),
          patientName: String(row[idx['Patient Name']] || ''),
          phone: String(row[idx['Phone']] || ''),
          email: String(row[idx['Email']] || ''),
          doctorId: String(row[idx['Doctor ID']] || ''),
          doctor: String(row[idx['Doctor Name']] || ''),
          specialty: String(row[idx['Specialty']] || ''),
          date: formatDate_(row[idx['Date']]),
          time: normalizeTime_(row[idx['Time']]),
          reason: String(row[idx['Reason']] || ''),
          status: String(row[idx['Status']] || '')
        }
      };
    }
  }

  return {
    success: false,
    error: 'Appointment not found.'
  };
}

function updateAppointmentStatus_(data) {
  const appointmentId = clean_(data.appointmentId, 100);
  const status = String(data.status || '').trim().toLowerCase();

  if (!appointmentId) {
    throw Error('Appointment number is required.');
  }

  if (ALLOWED_STATUSES.indexOf(status) === -1) {
    throw Error('Invalid appointment status.');
  }

  const sheet = getRequiredSheet_(getDb_(), CF.sheets.appointments);
  const rows = getDataRows_(sheet);
  const idx = headerIndexes_(sheet);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (String(row[idx['Appointment ID']] || '').trim() === appointmentId) {
      const sheetRow = i + 2;
      sheet.getRange(sheetRow, idx['Status'] + 1).setValue(status);
      sheet.getRange(sheetRow, idx['Updated At'] + 1).setValue(new Date());

      audit_(
        'UPDATE_APPOINTMENT_STATUS',
        appointmentId,
        JSON.stringify({ status: status })
      );

      return {
        success: true,
        appointmentId: appointmentId,
        status: status
      };
    }
  }

  throw Error('Appointment not found.');
}

function findOrCreatePatient_(name, phone, email, now) {
  const sheet = getRequiredSheet_(getDb_(), CF.sheets.patients);
  const rows = getDataRows_(sheet);
  const idx = headerIndexes_(sheet);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (normalizePhone_(row[idx['Phone']]) === normalizePhone_(phone)) {
      const sheetRow = i + 2;
      sheet.getRange(sheetRow, idx['Name'] + 1).setValue(name);

      if (idx['Email'] !== undefined) {
        sheet.getRange(sheetRow, idx['Email'] + 1).setValue(email);
      }

      sheet.getRange(sheetRow, idx['Updated At'] + 1).setValue(now);

      return {
        id: String(row[idx['Patient ID']] || ''),
        name: name,
        phone: phone,
        email: email
      };
    }
  }

  const id = nextId_('PAT');

  sheet.appendRow([
    id,
    name,
    phone,
    email,
    now,
    now
  ]);

  return {
    id: id,
    name: name,
    phone: phone,
    email: email
  };
}

function notifyNewAppointment_(appointment) {
  const email = PropertiesService
    .getScriptProperties()
    .getProperty('CLINICFLOW_NOTIFICATION_EMAIL');

  if (!email) {
    logNotification_(
      'NEW_APPOINTMENT',
      '',
      'NOT_CONFIGURED',
      appointment.appointmentId,
      'Booking saved. Configure CLINICFLOW_NOTIFICATION_EMAIL to receive email notifications.'
    );
    return;
  }

  const subject = 'ClinicFlow - New Appointment ' + appointment.appointmentId;
  const body =
    'A new patient appointment has been submitted.\\n\\n' +
    'Appointment: ' + appointment.appointmentId + '\\n' +
    'Patient: ' + appointment.patientName + '\\n' +
    'Phone: ' + appointment.phone + '\\n' +
    'Doctor: ' + appointment.doctorName + '\\n' +
    'Specialty: ' + appointment.specialty + '\\n' +
    'Date: ' + appointment.date + '\\n' +
    'Time: ' + appointment.time + '\\n' +
    'Reason: ' + appointment.reason + '\\n\\n' +
    'ClinicFlow notification.';

  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body
    });

    logNotification_(
      'NEW_APPOINTMENT',
      email,
      'SENT',
      appointment.appointmentId,
      'Notification email sent successfully.'
    );
  } catch (err) {
    logNotification_(
      'NEW_APPOINTMENT',
      email,
      'FAILED',
      appointment.appointmentId,
      String(err.message || err)
    );
  }
}

function logNotification_(type, recipient, status, recordId, details) {
  try {
    const sheet = getRequiredSheet_(getDb_(), CF.sheets.notifications);
    sheet.appendRow([
      new Date(),
      type,
      recipient,
      type,
      status,
      recordId,
      details
    ]);
  } catch (err) {
    Logger.log('Notification log error: ' + String(err.message || err));
  }
}

function nextId_(prefix) {
  const props = PropertiesService.getScriptProperties();
  const key = 'SEQ_' + prefix;
  const next = Number(props.getProperty(key) || 0) + 1;

  props.setProperty(key, String(next));

  return prefix + '-' +
    Utilities.formatDate(new Date(), CF.timezone, 'yyyyMMdd') +
    '-' +
    String(next).padStart(4, '0');
}

function seedDoctors_(ss) {
  const sheet = getRequiredSheet_(ss, CF.sheets.doctors);
  const rows = getDataRows_(sheet);

  if (rows.length > 0) {
    return;
  }

  sheet.getRange(2, 1, DEFAULT_DOCTORS.length, HEADERS.Doctors.length)
    .setValues(DEFAULT_DOCTORS);
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

  return sheet;
}

/**
 * Repairs missing required columns without deleting existing data.
 * Existing columns are preserved. Missing columns are appended.
 */
function repairHeaders_(ss) {
  Object.keys(HEADERS).forEach(function(name) {
    const expected = HEADERS[name];
    const sheet = getRequiredSheet_(ss, name);
    const current = getHeaderValues_(sheet);

    expected.forEach(function(header) {
      if (current.indexOf(header) === -1) {
        const newColumn = Math.max(1, sheet.getLastColumn()) + 1;
        sheet.getRange(1, newColumn).setValue(header);
        sheet.getRange(1, newColumn).setFontWeight('bold');
      }
    });

    sheet.setFrozenRows(1);
  });
}

function getHeaderValues_(sheet) {
  const lastColumn = Math.max(1, sheet.getLastColumn());
  return sheet.getRange(1, 1, 1, lastColumn)
    .getDisplayValues()[0]
    .map(function(x) { return String(x || '').trim(); });
}

function headerIndexes_(sheet) {
  const headers = getHeaderValues_(sheet);
  const result = {};

  headers.forEach(function(header, index) {
    result[header] = index;
  });

  return result;
}

function getDataRows_(sheet) {
  if (sheet.getLastRow() < 2) {
    return [];
  }

  return sheet.getRange(
    2,
    1,
    sheet.getLastRow() - 1,
    Math.max(1, sheet.getLastColumn())
  ).getValues();
}

function getRequiredSheet_(ss, name) {
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    ensureSheet_(ss, name, HEADERS[name] || []);
    sheet = ss.getSheetByName(name);
  }

  return sheet;
}

function getOrCreateSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const existingId = props.getProperty('CLINICFLOW_SPREADSHEET_ID');

  if (existingId) {
    try {
      return SpreadsheetApp.openById(existingId);
    } catch (err) {
      props.deleteProperty('CLINICFLOW_SPREADSHEET_ID');
    }
  }

  const active = SpreadsheetApp.getActiveSpreadsheet();

  if (active) {
    props.setProperty('CLINICFLOW_SPREADSHEET_ID', active.getId());
    return active;
  }

  const created = SpreadsheetApp.create(CF.spreadsheetName);
  props.setProperty('CLINICFLOW_SPREADSHEET_ID', created.getId());
  return created;
}

function getDb_() {
  const id = PropertiesService
    .getScriptProperties()
    .getProperty('CLINICFLOW_SPREADSHEET_ID');

  if (!id) {
    throw Error('ClinicFlow database is not configured. Run setupClinicFlow() once.');
  }

  try {
    return SpreadsheetApp.openById(id);
  } catch (err) {
    throw Error(
      'ClinicFlow cannot open the Google Sheet. ' +
      'Run setupClinicFlow() again and verify the Apps Script account has access.'
    );
  }
}

function databaseReady_() {
  try {
    const ss = getDb_();
    return {
      ready: true,
      spreadsheetId: ss.getId()
    };
  } catch (err) {
    return {
      ready: false,
      error: String(err.message || err)
    };
  }
}

function buildSlots_(start, end, duration) {
  const output = [];
  let current = toMinutes_(start);
  const finish = toMinutes_(end);

  if (finish <= current) {
    return output;
  }

  while (current + duration <= finish) {
    output.push(minutesToTime_(current));
    current += duration;
  }

  return output;
}

function parseWorkingDays_(value) {
  if (Array.isArray(value)) {
    return value.map(Number).filter(function(n) {
      return n >= 0 && n <= 6;
    });
  }

  return String(value == null ? '' : value)
    .split(',')
    .map(function(x) { return Number(String(x).trim()); })
    .filter(function(n) {
      return !isNaN(n) && n >= 0 && n <= 6;
    });
}

function parseBoolean_(value, defaultValue) {
  if (value === '' || value === null || value === undefined) {
    return defaultValue;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const text = String(value).trim().toLowerCase();

  if (['true','yes','1','active','enabled'].indexOf(text) !== -1) {
    return true;
  }

  if (['false','no','0','inactive','disabled'].indexOf(text) !== -1) {
    return false;
  }

  return defaultValue;
}

function normalizePhone_(value) {
  return String(value == null ? '' : value)
    .replace(/[^0-9+]/g, '')
    .trim();
}

function normalizeTime_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, CF.timezone, 'HH:mm');
  }

  const text = String(value == null ? '' : value).trim();

  if (!text) {
    return '';
  }

  const match = text.match(/^(\\d{1,2}):(\\d{2})/);

  if (match) {
    return String(Number(match[1])).padStart(2, '0') + ':' + match[2];
  }

  return text;
}

function toMinutes_(value) {
  const text = normalizeTime_(value);
  const parts = text.split(':').map(Number);

  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    return 0;
  }

  return parts[0] * 60 + parts[1];
}

function minutesToTime_(minutes) {
  return String(Math.floor(minutes / 60)).padStart(2, '0') +
    ':' +
    String(minutes % 60).padStart(2, '0');
}

function formatDate_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, CF.timezone, 'yyyy-MM-dd');
  }

  const text = String(value == null ? '' : value).trim();

  if (/^\\d{4}-\\d{2}-\\d{2}/.test(text)) {
    return text.slice(0, 10);
  }

  const parsed = new Date(text);

  if (!isNaN(parsed.getTime())) {
    return Utilities.formatDate(parsed, CF.timezone, 'yyyy-MM-dd');
  }

  return text.slice(0, 10);
}

function saveSetting_(ss, key, value) {
  const sheet = getRequiredSheet_(ss, CF.sheets.settings);
  const rows = getDataRows_(sheet);
  const idx = headerIndexes_(sheet);

  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][idx['Key']] || '') === key) {
      sheet.getRange(i + 2, idx['Value'] + 1).setValue(value);
      sheet.getRange(i + 2, idx['Updated At'] + 1).setValue(new Date());
      return;
    }
  }

  sheet.appendRow([key, value, new Date()]);
}

function audit_(action, recordId, details) {
  try {
    getRequiredSheet_(getDb_(), CF.sheets.audit).appendRow([
      new Date(),
      action,
      'web-app',
      recordId,
      details
    ]);
  } catch (err) {
    Logger.log('Audit error: ' + String(err.message || err));
  }
}

function logError_(requestId, method, err) {
  try {
    audit_(
      'API_ERROR',
      requestId,
      JSON.stringify({
        method: method,
        error: String(err && err.message ? err.message : err)
      })
    );
  } catch (_) {
    Logger.log('API error [' + requestId + ']: ' + String(err));
  }
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  const content = String(e.postData.contents || '').trim();

  if (!content) {
    return {};
  }

  try {
    return JSON.parse(content);
  } catch (err) {
    throw Error('Invalid JSON request body.');
  }
}

function clean_(value, maxLength) {
  const text = String(value == null ? '' : value).trim();
  return text.slice(0, maxLength || 500);
}

function makeRequestId_() {
  return 'REQ-' +
    Utilities.formatDate(new Date(), CF.timezone, 'yyyyMMdd-HHmmss') +
    '-' +
    Utilities.getUuid().slice(0, 8);
}

function withRequestId_(result, requestId) {
  result.requestId = requestId;
  return result;
}

function friendlyError_(err) {
  const message = String(err && err.message ? err.message : err);

  if (message.indexOf('Service Spreadsheets failed') !== -1) {
    return 'Google Sheets is temporarily unavailable. Please try again.';
  }

  return message;
}

function json_(object) {
  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
