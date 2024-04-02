 
 import * as XLSX from "xlsx";
 

 export const exportToExcel = (dataSource: any[]) => {
     const fileName = "données.xlsx";
     const worksheet = XLSX.utils.json_to_sheet(dataSource);
     const workbook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(workbook, worksheet, "données");
     XLSX.writeFile(workbook, fileName);
    //  XLSX.writeFile(workbook,fileName);
   };
   