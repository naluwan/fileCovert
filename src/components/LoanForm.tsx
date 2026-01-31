import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface ProductRow {
  itemNo: string
  productCode: string
  productName: string
  spec: string
  multiple: string
  shelfNo: string
}

export default function LoanForm() {
  const [formData, setFormData] = useState({
    departmentName: '',
    contactPerson: '',
    stampDate: new Date().toISOString().split('T')[0],
    storeNo: '',
    storeName: '',
    specialist: '',
    returnDate: '',
    deliveryNote: '',
  })

  const [products, setProducts] = useState<ProductRow[]>([
    { itemNo: '', productCode: '', productName: '', spec: '', multiple: '', shelfNo: '' },
    { itemNo: '', productCode: '', productName: '', spec: '', multiple: '', shelfNo: '' },
    { itemNo: '', productCode: '', productName: '', spec: '', multiple: '', shelfNo: '' },
    { itemNo: '', productCode: '', productName: '', spec: '', multiple: '', shelfNo: '' },
    { itemNo: '', productCode: '', productName: '', spec: '', multiple: '', shelfNo: '' },
    { itemNo: '', productCode: '', productName: '', spec: '', multiple: '', shelfNo: '' },
    { itemNo: '', productCode: '', productName: '', spec: '', multiple: '', shelfNo: '' },
    { itemNo: '', productCode: '', productName: '', spec: '', multiple: '', shelfNo: '' },
    { itemNo: '', productCode: '', productName: '', spec: '', multiple: '', shelfNo: '' },
    { itemNo: '', productCode: '', productName: '', spec: '', multiple: '', shelfNo: '' },
    { itemNo: '', productCode: '', productName: '', spec: '', multiple: '', shelfNo: '' },
    { itemNo: '', productCode: '', productName: '', spec: '', multiple: '', shelfNo: '' },
  ])

  const [showPreview, setShowPreview] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleProductChange = (index: number, field: keyof ProductRow, value: string) => {
    setProducts(prev => {
      const newProducts = [...prev]
      newProducts[index] = { ...newProducts[index], [field]: value }
      return newProducts
    })
  }

  const formatStampDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  const handleExportPDF = async () => {
    const element = document.getElementById('loan-form-preview')
    if (!element) return

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)

      const dateStr = formatStampDate(formData.stampDate).replace(/\./g, '').slice(4)
      const fileName = `${formData.storeNo}${formData.storeName}借貨單 ${dateStr}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('PDF 生成失敗:', error)
      alert('PDF 生成失敗，請重試')
    }
  }

  const addRow = () => {
    setProducts(prev => [...prev, { itemNo: '', productCode: '', productName: '', spec: '', multiple: '', shelfNo: '' }])
  }

  const removeRow = (index: number) => {
    if (products.length > 1) {
      setProducts(prev => prev.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8 safe-area-inset">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">借貨單生成器</h1>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">基本資料</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <Label htmlFor="departmentName" className="text-sm">部門名稱</Label>
              <Input
                id="departmentName"
                value={formData.departmentName}
                onChange={(e) => handleInputChange('departmentName', e.target.value)}
                placeholder="例：大肚物流"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contactPerson" className="text-sm">聯絡人</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="例：陳襄理"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="stampDate" className="text-sm">借貨專用章日期</Label>
              <Input
                id="stampDate"
                type="date"
                value={formData.stampDate}
                onChange={(e) => handleInputChange('stampDate', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="storeNo" className="text-sm">店號</Label>
              <Input
                id="storeNo"
                value={formData.storeNo}
                onChange={(e) => handleInputChange('storeNo', e.target.value)}
                placeholder="例：020849"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="storeName" className="text-sm">店名</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => handleInputChange('storeName', e.target.value)}
                placeholder="例：台中錦華店"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="deliveryNote" className="text-sm">到店備註</Label>
              <Input
                id="deliveryNote"
                value={formData.deliveryNote}
                onChange={(e) => handleInputChange('deliveryNote', e.target.value)}
                placeholder="例：請於 1/23到店，謝謝！"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="specialist" className="text-sm">專員</Label>
              <Input
                id="specialist"
                value={formData.specialist}
                onChange={(e) => handleInputChange('specialist', e.target.value)}
                placeholder="例：李翊瑄"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="returnDate" className="text-sm">預計訂還日期</Label>
              <Input
                id="returnDate"
                value={formData.returnDate}
                onChange={(e) => handleInputChange('returnDate', e.target.value)}
                placeholder="例：1/24"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold">商品明細</h2>
            <Button onClick={addRow} variant="outline" size="sm" className="text-xs sm:text-sm">
              + 新增一列
            </Button>
          </div>

          {/* Mobile: Card View */}
          <div className="block sm:hidden space-y-3">
            {products.map((product, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">第 {index + 1} 項</span>
                  <Button
                    onClick={() => removeRow(index)}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-500">項次</Label>
                    <Input
                      className="h-9 text-sm"
                      value={product.itemNo}
                      onChange={(e) => handleProductChange(index, 'itemNo', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">商品代號</Label>
                    <Input
                      className="h-9 text-sm"
                      value={product.productCode}
                      onChange={(e) => handleProductChange(index, 'productCode', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-500">品名</Label>
                    <Input
                      className="h-9 text-sm"
                      value={product.productName}
                      onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">規格</Label>
                    <Input
                      className="h-9 text-sm"
                      value={product.spec}
                      onChange={(e) => handleProductChange(index, 'spec', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">倍數</Label>
                    <Input
                      className="h-9 text-sm"
                      value={product.multiple}
                      onChange={(e) => handleProductChange(index, 'multiple', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-500">架號</Label>
                    <Input
                      className="h-9 text-sm"
                      value={product.shelfNo}
                      onChange={(e) => handleProductChange(index, 'shelfNo', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1 w-16">項次</th>
                  <th className="border border-gray-300 px-2 py-1 w-24">商品代號</th>
                  <th className="border border-gray-300 px-2 py-1">品名</th>
                  <th className="border border-gray-300 px-2 py-1 w-24">規格</th>
                  <th className="border border-gray-300 px-2 py-1 w-20">倍數</th>
                  <th className="border border-gray-300 px-2 py-1 w-20">架號</th>
                  <th className="border border-gray-300 px-2 py-1 w-16">操作</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-1 py-1">
                      <Input
                        className="h-8 text-center"
                        value={product.itemNo}
                        onChange={(e) => handleProductChange(index, 'itemNo', e.target.value)}
                      />
                    </td>
                    <td className="border border-gray-300 px-1 py-1">
                      <Input
                        className="h-8"
                        value={product.productCode}
                        onChange={(e) => handleProductChange(index, 'productCode', e.target.value)}
                      />
                    </td>
                    <td className="border border-gray-300 px-1 py-1">
                      <Input
                        className="h-8"
                        value={product.productName}
                        onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                      />
                    </td>
                    <td className="border border-gray-300 px-1 py-1">
                      <Input
                        className="h-8"
                        value={product.spec}
                        onChange={(e) => handleProductChange(index, 'spec', e.target.value)}
                      />
                    </td>
                    <td className="border border-gray-300 px-1 py-1">
                      <Input
                        className="h-8 text-center"
                        value={product.multiple}
                        onChange={(e) => handleProductChange(index, 'multiple', e.target.value)}
                      />
                    </td>
                    <td className="border border-gray-300 px-1 py-1">
                      <Input
                        className="h-8 text-center"
                        value={product.shelfNo}
                        onChange={(e) => handleProductChange(index, 'shelfNo', e.target.value)}
                      />
                    </td>
                    <td className="border border-gray-300 px-1 py-1 text-center">
                      <Button
                        onClick={() => removeRow(index)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              className="w-full sm:w-auto px-6 py-2"
            >
              {showPreview ? '隱藏預覽' : '顯示預覽'}
            </Button>
            <Button
              onClick={handleExportPDF}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
            >
              轉換並下載 PDF
            </Button>
          </div>
        </div>

        {/* Preview - Collapsible on mobile */}
        {showPreview && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">預覽</h2>
            <div className="overflow-auto border border-gray-300 rounded">
              <div
                id="loan-form-preview"
                className="bg-white mx-auto"
                style={{
                  width: '794px',
                  minHeight: '1123px',
                  padding: '40px 50px',
                  fontFamily: '"Microsoft JhengHei", "PingFang TC", "Noto Sans TC", sans-serif',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              >
                {/* Row 1 - Title Only */}
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                  <span style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '1.5em' }}>借貨單</span>
                </div>

                {/* Row 2 - Department Info + Manager Info + Stamp */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  {/* Left Side - Department Info */}
                  <div>
                    <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                      <span style={{
                        backgroundColor: '#90EE90',
                        padding: '4px 12px',
                        display: 'inline-block',
                        textAlign: 'center',
                        lineHeight: '1.4',
                        minWidth: '80px'
                      }}>{formData.departmentName || '\u00A0'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{
                        color: '#228B22',
                        padding: '4px 12px',
                        display: 'inline-block',
                        textAlign: 'center',
                        lineHeight: '1.4',
                        minWidth: '80px'
                      }}>{formData.contactPerson || '\u00A0'}</span>
                    </div>
                  </div>

                  {/* Right Side - Manager Info + Stamp */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* Manager Info - 上下對齊 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <div style={{ marginBottom: '4px', lineHeight: '1.4', padding: '4px 0' }}>物流部</div>
                      <div style={{ lineHeight: '1.4', padding: '4px 0' }}>葉經理</div>
                    </div>
                    {/* Stamp */}
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        border: '3px double #DC143C',
                        borderRadius: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#DC143C',
                        fontWeight: 'bold',
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>物流部</span>
                      <span
                        style={{
                          fontSize: '11px',
                          backgroundColor: 'yellow',
                          padding: '2px 6px',
                          margin: '2px 0',
                          display: 'inline-block',
                          textAlign: 'center',
                          lineHeight: '1.4',
                        }}
                      >
                        {formatStampDate(formData.stampDate)}
                      </span>
                      <span style={{ fontSize: '10px' }}>借貨專用章</span>
                    </div>
                  </div>
                </div>

                {/* Store Info Row */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ marginRight: '10px' }}>店號</span>
                  <span style={{
                    border: '1px solid black',
                    padding: '4px 15px',
                    marginRight: '5px',
                    display: 'inline-block',
                    textAlign: 'center',
                    lineHeight: '1.4',
                    minWidth: '60px'
                  }}>{formData.storeNo || '\u00A0'}</span>
                  <span style={{
                    backgroundColor: '#FFFF00',
                    padding: '4px 15px',
                    marginRight: 'auto',
                    display: 'inline-block',
                    textAlign: 'center',
                    lineHeight: '1.4',
                    minWidth: '80px'
                  }}>{formData.storeName || '\u00A0'}</span>
                  <span style={{ marginRight: '10px' }}>區分</span>
                  <span style={{
                    backgroundColor: '#90EE90',
                    padding: '4px 40px',
                    display: 'inline-block',
                    lineHeight: '1.4'
                  }}></span>
                </div>

                {/* Delivery Note */}
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <span style={{
                    backgroundColor: '#87CEEB',
                    padding: '4px 15px',
                    fontSize: '13px',
                    display: 'inline-block',
                    textAlign: 'center',
                    lineHeight: '1.4'
                  }}>
                    {formData.deliveryNote || '\u00A0'}
                  </span>
                </div>

                {/* Product Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid black', padding: '4px 8px', width: '50px', fontWeight: 'normal' }}>項次</th>
                      <th style={{ border: '1px solid black', padding: '4px 8px', width: '80px', fontWeight: 'normal' }}>商品代號</th>
                      <th style={{ border: '1px solid black', padding: '4px 8px', fontWeight: 'normal' }} colSpan={2}>品&emsp;&emsp;名</th>
                      <th style={{ border: '1px solid black', padding: '4px 8px', width: '60px', fontWeight: 'normal' }}>規&emsp;格</th>
                      <th style={{ border: '1px solid black', padding: '4px 8px', width: '60px', fontWeight: 'normal' }}>倍&emsp;數</th>
                      <th style={{ border: '1px solid black', padding: '4px 8px', width: '60px', fontWeight: 'normal' }}>架&emsp;號</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid black', padding: '4px 8px', textAlign: 'center', height: '24px' }}>{product.itemNo}</td>
                        <td style={{ border: '1px solid black', padding: '4px 8px', textAlign: 'center' }}>{product.productCode}</td>
                        <td style={{ border: '1px solid black', padding: '4px 8px' }} colSpan={2}>{product.productName}</td>
                        <td style={{ border: '1px solid black', padding: '4px 8px', textAlign: 'center' }}>{product.spec}</td>
                        <td style={{ border: '1px solid black', padding: '4px 8px', textAlign: 'center' }}>{product.multiple}</td>
                        <td style={{ border: '1px solid black', padding: '4px 8px', textAlign: 'center' }}>{product.shelfNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer */}
                <div style={{ marginTop: '40px' }}>
                  <div style={{ display: 'flex', marginBottom: '30px' }}>
                    <span style={{ marginRight: '150px' }}>簽收人：</span>
                    <span>店印：</span>
                  </div>
                  <div style={{ marginBottom: '5px' }}>
                    <span>※由物流部代替店鋪補訂購歸還DC</span>
                    <span style={{ marginLeft: '20px' }}>（專員：{formData.specialist}</span>
                    <span style={{ marginLeft: '50px' }}>）</span>
                  </div>
                  <div>
                    <span style={{
                      backgroundColor: '#87CEEB',
                      padding: '4px 12px',
                      display: 'inline-block',
                      textAlign: 'center',
                      lineHeight: '1.4'
                    }}>預計訂還日期：{formData.returnDate || '\u00A0'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
