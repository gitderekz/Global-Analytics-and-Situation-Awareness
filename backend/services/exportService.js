const fs = require('fs');
const path = require('path');
const db = require('../models');

const exportsDir = path.join(__dirname, '..', 'uploads', 'exports');
if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });

const modelMap = {
  events: { model: db.Event, columns: ['id', 'eventType', 'title', 'severity', 'status', 'country', 'city', 'latitude', 'longitude', 'createdAt'] },
  assets: { model: db.Asset, columns: ['id', 'assetType', 'name', 'status', 'latitude', 'longitude', 'speed', 'updatedAt'] },
  devices: { model: db.Device, columns: ['id', 'deviceId', 'name', 'deviceType', 'status', 'latitude', 'longitude', 'lastSeen'] },
  alerts: { model: db.Alert, columns: ['id', 'title', 'severity', 'status', 'createdAt'] },
  threats: { model: db.Threat, columns: ['id', 'threatType', 'sourceIp', 'destinationIp', 'country', 'severity', 'status'] },
  transactions: { model: db.Transaction, columns: ['id', 'transactionId', 'amount', 'currency', 'riskLevel', 'status', 'timestamp'] },
};

const toCSV = (rows, columns) => {
  const header = columns.join(',');
  const lines = rows.map((row) =>
    columns.map((col) => {
      const val = row[col];
      if (val === null || val === undefined) return '';
      const str = String(val).replace(/"/g, '""');
      return str.includes(',') ? `"${str}"` : str;
    }).join(',')
  );
  return [header, ...lines].join('\n');
};

const generateCSV = async (type, userId) => {
  const config = modelMap[type];
  if (!config) throw new Error(`Unknown report type: ${type}`);

  const rows = await config.model.findAll({ limit: 10000, order: [['id', 'DESC']], raw: true });
  const csv = toCSV(rows, config.columns);
  const fileName = `${type}_${Date.now()}.csv`;
  const filePath = path.join(exportsDir, fileName);
  fs.writeFileSync(filePath, csv);

  await db.Report.create({
    name: `${type} export`,
    type: 'csv',
    filePath,
    generatedBy: userId,
    generatedAt: new Date(),
  });

  return { fileName, filePath, content: csv };
};

const generateJSON = async (type) => {
  const config = modelMap[type];
  if (!config) throw new Error(`Unknown report type: ${type}`);
  const rows = await config.model.findAll({ limit: 10000, order: [['id', 'DESC']] });
  return rows;
};

// Simple tab-separated format compatible with Excel without external libs
const generateExcel = async (type, userId) => {
  const config = modelMap[type];
  if (!config) throw new Error(`Unknown report type: ${type}`);

  const rows = await config.model.findAll({ limit: 10000, order: [['id', 'DESC']], raw: true });
  const header = config.columns.join('\t');
  const lines = rows.map((row) =>
    config.columns.map((col) => row[col] ?? '').join('\t')
  );
  const content = [header, ...lines].join('\n');
  const fileName = `${type}_${Date.now()}.xls`;
  const filePath = path.join(exportsDir, fileName);
  fs.writeFileSync(filePath, content);

  await db.Report.create({
    name: `${type} export`,
    type: 'excel',
    filePath,
    generatedBy: userId,
    generatedAt: new Date(),
  });

  return { fileName, filePath, content };
};

// Minimal PDF-like text report (no external dependency)
const generatePDF = async (type, userId) => {
  const config = modelMap[type];
  if (!config) throw new Error(`Unknown report type: ${type}`);

  const rows = await config.model.findAll({ limit: 500, order: [['id', 'DESC']], raw: true });
  const lines = [
    `Global Analytics Platform - ${type.toUpperCase()} Report`,
    `Generated: ${new Date().toISOString()}`,
    `Total Records: ${rows.length}`,
    '',
    config.columns.join(' | '),
    '-'.repeat(80),
    ...rows.map((row) => config.columns.map((c) => String(row[c] ?? '')).join(' | ')),
  ];
  const content = lines.join('\n');
  const fileName = `${type}_${Date.now()}.txt`;
  const filePath = path.join(exportsDir, fileName);
  fs.writeFileSync(filePath, content);

  await db.Report.create({
    name: `${type} report`,
    type: 'pdf',
    filePath,
    generatedBy: userId,
    generatedAt: new Date(),
  });

  return { fileName, filePath, content };
};

module.exports = { generateCSV, generateExcel, generatePDF, generateJSON, exportsDir };
