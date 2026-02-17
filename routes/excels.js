
const express = require('express');
const router = express.Router();
const upload = require('../backend/config/multerConfig'); 
const { isAuthenticated } = require('../frontend/middleware/authMiddleware');

const getExcelE = require('../backend/bin/ExcelE')
const getExcelM = require('../backend/bin/ExcelM')
const getExcelA = require('../backend/bin/ExcelA')
const getExcelRPS = require('../backend/bin/ExcelRPS')

router.get('/ExcelE', isAuthenticated, upload.none(), async (req, res) => {
    getExcelE(res)
})

router.get('/ExcelM', isAuthenticated, upload.none(), async (req, res) => {
  getExcelM(res)
})

router.get('/ExcelA', isAuthenticated, upload.none(), async (req, res) => {
    getExcelA(res)
})

router.get('/ExcelRPS', isAuthenticated, upload.none(), async (req, res) => {
  getExcelRPS(res)
})

module.exports = router;