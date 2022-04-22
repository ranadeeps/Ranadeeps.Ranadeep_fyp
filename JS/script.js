//inData = [];
var itr=[];
var ppv=[];
var ppb=[];
var psd =[];
var pv=[];
var fpv=[];
var ip=[0.7,0.3];//c
var xb=[];
var gb=[];
var gs=[];
var lmd=[5,5,5];//c
var tt=0.5;//c
var ds=[];
var b=0;
var s=0;
function UploadProcess() {
    var fileUpload = document.getElementById("formFile");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    GetTableFromExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    GetTableFromExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
            document.getElementById('status').innerHTML="File Uploaded successfully";
            document.getElementById('pClass').innerHTML="Prosumer Classification";
        }else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
    
};
function GetTableFromExcel(data) {
    var workbook = XLSX.read(data, {
        type: 'binary'
    });
    var Sheet = workbook.SheetNames[0];
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[Sheet]);
    var myTable  = document.createElement("table");
    var row = myTable.insertRow(-1);
    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Prosumer";
    row.appendChild(headerCell);
    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Price";
    row.appendChild(headerCell);
    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Generation";
    row.appendChild(headerCell);
    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Demand";
    row.appendChild(headerCell);
    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Type";
    row.appendChild(headerCell);
    for (var i = 0; i < excelRows.length; i++) {
        var row = myTable.insertRow(-1);
        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Prosumer;        
        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Price;
        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Generation;          
        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Demand;
        cell = row.insertCell(-1);
        if (excelRows[i].Generation/excelRows[i].Demand > 1){
            cell.innerHTML = "Seller";
            //cell = row.insertCell(-1);
            pv.push(parseInt(excelRows[i].Price));
            gs.push(parseInt(excelRows[i].Generation));
            ds.push(parseInt(excelRows[i].Demand));
            s=s+1;
            
        }else if(excelRows[i].Generation/excelRows[i].Demand < 1){
            cell.innerHTML = "Buyer";
            //cell = row.insertCell(-1);
            xb.push(parseInt(excelRows[i].Demand-excelRows[i].Generation));
            gb.push(parseInt(excelRows[i].Generation));
            b=b+1;
        }else{
            cell.innerHTML = "Self sufficient";
        }
    }
    for(var j=0;j<s;j++){
        ppv[j] = [];
        ppb[j] = [];
        psd[j] = [];
    }
    //To display table
    // document.getElementById("pClassi").innerHTML="Prosumer Classification";
    var ExcelTable = document.getElementById("ExcelTable");
    // ExcelTable.innerHTML = "";
    ExcelTable.appendChild(myTable);
}

//a1(pv,ip,xb,gb,gs,lmd,tt,ds,b,s);
function a1(pv,ip,xb,gb,gs,lmd,tt,ds,b,s){
    var k=0;
    var w=[];
    var xt=[];
    var sj=[];
    var vj=[];
    var sig=[];
    while (1){
        k=k+1;
        for(var j=0;j<s;j++){
            for(var i=0;i<b;i++){
                w[i] = (lmd[i]*(xb[i]+gb[i]))-(tt*(xb[i]+gb[i])*(xb[i]+gb[i]))/2 - pv[j]*xb[i];
                xt[i] = w[i];
            }
            sj[j] = ip[j] * su(xt);
            vj[j] = (gs[j]-ds[j])/sj[j];
            if(vj[j]>=1){
                sig[j] = (0.5*su(muc(sqa(xt),0.5))) + (su(suba(mua(lmd,gb),muc(sqa(gb),0.25))));
            }
            if(vj[j]<1){
                sig[j] = (vj[j] - (vj[j]*vj[j])/2) *  (su(suba(sua(muc(sqa(xt),0.5),mua(lmd,gb)),muc(sqa(gb),0.25))));
            }
        }
        var si = su(mua(ip,sig));
        ip = sua(ip,muc(mua(ip,subc(sig,si)),0.0003));
        var flg=0;
        for(var z=0;z<s;z++){
            if(Math.abs(sig[z]-si)>1){
                flg=1;
            }
        }
        if(flg==0){
            return ip;
        }
    }
}
var a;
var xt=[];
function a2(pv,ip,xb,gb,gs,lmd,tt,ds,b,s){
    var k = 0;
    var w=[];
    //var xt=[];
    var sd;
    var sj;
    //var a;
    while(1){
        k=k+1;
        itr.push(k);
        for(var i=0;i<s;i++){
            ppv[i].push(pv[i]);
        }
        // ppv1.push(pv[0]);
        // ppv2.push(pv[1]);
        a = a1(pv,ip,xb,gb,gs,lmd,tt,ds,b,s);
        for(var i=0;i<s;i++){
            ppb[i].push(a[i]);
        }
        for(var j=0;j<s;j++){
            for(var i=0;i<b;i++){
                w[i] = (lmd[i]*(xb[i]+gb[i]))-(tt*((xb[i]+gb[i])*(xb[i]+gb[i])))/2 - (pv[j]*xb[i]);
                xt[i] = w[i]; 
            }
        }
        sj = muc(a,su(xt));
        sd = diva(suba(gs,ds),sj);
        for(var i=0;i<s;i++){
            psd[i].push(sd[i]);
        }
        pv = sua(pv,muc(sua(suba(sj,gs),ds),0.0003));
        fpv = pv;
        var flg=0;
        for(var z=0;z<s;z++){
            if(Math.abs(sj[z]+ds[z]-gs[z])>1){
                flg=1;
            }
        }
        if(flg==0){
            console.log("Final Price");
            //console.log(pv);
            document.getElementById('status').innerHTML="Process Completed";
            return;
        }
    }
}
function a3(){
    a2(pv,ip,xb,gb,gs,lmd,tt,ds,b,s);
}
const ctx1 = document.getElementById('myChart1').getContext('2d');
    const myChart1 = new Chart(ctx1,{
        type: 'bubble',
        data: {
            labels: itr,
            datasets: [
        ]
        },
        options: {
            plugins:{
                title:{
                    display:true,
                    text:"Price Vs Iteration",
                }
            },
            scales: {
                y: {
                    title: {
                      display: true,
                      text: 'Power Price(in Rupees per KWh)'
                    }
                },
                x: {
                    title: {
                      display: true,
                      text: 'Iteration'
                    }
                  }
                // y: {
                //     beginAtZero: true
                // }
            }
        }
    });
const ctx2 = document.getElementById('myChart2').getContext('2d');
    const myChart2 = new Chart(ctx2,{
        type: 'bubble',
        data: {
            labels: itr,
            datasets: [
        ]
        },
        options: {
            plugins:{
                title:{
                    display:true,
                    text:"Probability Vs Iteration",
                }
            },
            scales: {
                y: {
                    title: {
                      display: true,
                      text: 'Seller Selection Probability'
                    }
                },
                x: {
                    title: {
                      display: true,
                      text: 'Iteration'
                    }
                  }
                // y: {
                //     beginAtZero: true
                // }
            }
        }
    });
const ctx3 = document.getElementById('myChart3').getContext('2d');
    const myChart3 = new Chart(ctx3,{
        type: 'bubble',
        data: {
            labels: itr,
            datasets: [
        ]
        },
        options: {
            plugins:{
                title:{
                    display:true,
                    text:"Supply-to-Demand Ratio Vs Iteration",
                }
            },
            scales: {
                y: {
                    title: {
                      display: true,
                      text: 'Supply-to-Demand Ratio'
                    }
                },
                x: {
                    title: {
                      display: true,
                      text: 'Iteration'
                    }
                  }
                // y: {
                //     beginAtZero: true
                // }
            }
        }
    });
    
function plt(){
    output();
    for(var i=0;i<s;i++){
        const newDataSet = {
            label:'Seller '+(i+1)+'',
            data: ppv[i],
            borderColor: 'rgba('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+',1)',
            backgroundColor: 'rgba('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+',1)'
        };
        myChart1.data.datasets.push(newDataSet);
    }
    for(var i=0;i<s;i++){
        const newDataSet = {
            label:'Seller '+(i+1)+'',
            data: ppb[i],
            borderColor: 'rgba('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+',1)',
            backgroundColor: 'rgba('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+',1)'
        };
        myChart2.data.datasets.push(newDataSet);
    }
    for(var i=0;i<s;i++){
        const newDataSet = {
            label:'Seller '+(i+1)+'',
            data: psd[i],
            borderColor: 'rgba('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+',1)',
            backgroundColor: 'rgba('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+',1)'
        };
        myChart3.data.datasets.push(newDataSet);
    }
    myChart1.update();
    myChart2.update();
    myChart3.update();
}
function output(){
    var r=s+1;
    var c=b+3;
    var table = document.createElement("table");
    // table.border = "1";
    for (let x = 0; x < r; x++) {
        var row = table.insertRow(-1);
        for(let y=0;y<c;y++){
            var cell = row.insertCell(-1);
            if(x==0&&y!=0){
                if(y==1){
                    cell.innerHTML = "<b>Price</b>"; 
                }
                else if(y==2){
                    cell.innerHTML = "<b>Probability</b>";
                }
                else{
                    cell.innerHTML = "<b>Buyer "+(y-2)+"</b>";
                }
            }
            else if(y==0&&x!=0){
                cell.innerHTML = "<b>Seller "+(x)+"</b>";
            }
            else if(x!=0&&y!=0){
                if(y==1){
                    console.log(pv);
                    cell.innerHTML = (fpv[x-1]).toFixed(2);
                }
                else if(y==2){
                    cell.innerHTML = (a[x-1]).toFixed(2);
                }
                else{
                    cell.innerHTML = (xt[y-3]*a[x-1]).toFixed(2);
                }
                
            }
        }
    }
    document.getElementById('pOut').innerHTML = "Output";
    var res = document.getElementById("outputTable");
    res.appendChild(table);   
}


// Functions
function su(arr){
    var tot = 0;
    for(var i in arr){
        tot = tot + arr[i];
    }
    return tot;
}
function sua(arr1,arr2){
    var res=[];
    for(var i=0;i<arr1.length;i++){
        res.push(arr1[i]+arr2[i]);
    }
    return res;
}
function sqa(arr){
    var res=[];
    for(var i=0;i<arr.length;i++){
        res.push((arr[i]*arr[i]));
    }
    return res;
}
function mua(arr1,arr2){
    var res=[];
    for(var i=0;i<arr1.length;i++){
        res.push(arr1[i]*arr2[i]);
    }
    return res;
}
function muc(arr,c){
    var res=[];
    for(var i=0;i<arr.length;i++){
        res.push(arr[i]*c);
    }
    return res;
}
function subc(arr,c){
    var res=[];
    for(var i=0;i<arr.length;i++){
        res.push(arr[i]-c);
    }
    return res;
}
function suba(arr1,arr2){
    var res=[];
    for(var i=0;i<arr1.length;i++){
        res.push(arr1[i]-arr2[i]);
    }
    return res;
}
function diva(arr1,arr2){
    var res=[];
    for(var i=0;i<arr1.length;i++){
        res.push(arr1[i]*(1.0)/arr2[i]);
    }
    return res;
}
//     {
//     label: 'Seller 1',
//     data: ppv1,
//     backgroundColor: [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         'rgba(255, 206, 86, 0.2)',
//         'rgba(75, 192, 192, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(255, 159, 64, 0.2)'
//     ],
//     borderColor: [
//         'rgba(255, 99, 132, 1)'
//     ],
//     borderWidth: 1
// },{
//     label: 'Seller 2',
//     data: ppv2,
//     backgroundColor: [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         'rgba(255, 206, 86, 0.2)',
//         'rgba(75, 192, 192, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(255, 159, 64, 0.2)'
//     ],
//     borderColor: [
//         'rgba(54, 162, 235, 1)'
//     ],
//     borderWidth: 1
// }
// var pv=[4,4];
// var ip=[0.7,0.3];//c
// var xb=[3,1,3];
// var gb=[5,10,5];
// var gs=[30,30];
// var lmd=[5,5,5];//c
// var tt=0.5;//c
// var ds=[10,10];
// var b=0;
// var s=0;