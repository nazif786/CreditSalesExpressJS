function exp() {
    //alert("Welcome to the javaTpoint.com");
    let data = document.getElementById('expData');
    var fp = XLSX.utils.table_to_book(data,['MySheets']);
    XLSX.write(fp, {
        bookType: 'xlsx',
        type: 'base64'
    });
    let d = new Date(Date.now())
    let D = d.getFullYear() + '_' + d.getMonth() + '_' + d.getDate() + '_Data'
    XLSX.writeFile(fp, D + '.xlsx')
}