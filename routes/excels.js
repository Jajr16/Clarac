
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); 

const getExcelE = require('../bin/ExcelE')
const getExcelM = require('../bin/ExcelM')
const getExcelA = require('../bin/ExcelA')

router.get('/ExcelE', upload.none(), async (req, res) => {
    getExcelE(res)
})

router.get('/ExcelM', upload.none(), async (req, res) => {
  getExcelM(res)
})

router.get('/ExcelA', upload.none(), async (req, res) => {
    getExcelA(res)
})

module.exports = router;