let showOnly = 5;
let file, file2,file3;
let searchInput = '';
let chart, chart2, chart3;
let chart4, chart5, chart6;
let reworkTypeSelected = '';
let productSelected = '';
let productArray = [];
let productArray2 = [];
let cha = '-';
let AOIdata, VIdata;
let reworkArray = [];
let reworkArray2 = [];

function alert(){
  console.log('warning suppressed');
}

// input file

document.getElementById('csvFileInput').addEventListener('change', function(event) { 
  document.getElementById('AOI').style.display = 'block';
  document.getElementById('Visual').style.display = 'block';
  file = event.target.files[0];
  Papa.parse(file,{
    header: true,
    complete: function(results) {    
        AOIdata = results.data.filter((row) => ((row['Board No'] !== undefined) && !(row['Board No'].includes('-'))));
        displayData(AOIdata);
        VIdata = results.data.filter((row) => ((row['Board No'] !== undefined) && (row['Board No'].includes('-'))));
        displayData2(VIdata);
    }
  });

  const selectElement = document.getElementById('productDynamicSelect');

  setTimeout(() => {
    for (let i = 0; i < productArray.length; i++) {
      const product = productArray[i];
      if (product == undefined) {
        continue;
      }
      const option = document.createElement('option');
      option.value = product;
      option.textContent = product;
      selectElement.appendChild(option);
      }
    }, 100);

    setTimeout(() => {
      for (let i = 0; i < productArray2.length; i++) {
        const product = productArray2[i];
        console.log(product);
        if (productArray.includes(product) || product == undefined) {
          continue;
        }
        const option = document.createElement('option');
        option.value = product;
        option.textContent = product;
        selectElement.appendChild(option);
      }
    }, 100);

    selectElement2 = document.getElementById('reworkTypeDynamicSelect');

    setTimeout(() => {
      
      for (let i = 0; i < reworkArray.length; i++) {
        const rework = reworkArray[i];
        if (rework == undefined) {
          continue;
        }
        const option = document.createElement('option');
        option.value = rework;
        option.textContent = rework;
        selectElement2.appendChild(option);
      }
    }, 100);

    setTimeout(() => {
      
      for (let i = 0; i < reworkArray2.length; i++) {
        const rework = reworkArray2[i];
        if (rework == undefined || reworkArray.includes(rework)) {
          continue;
        }
        const option = document.createElement('option');
        option.value = rework;
        option.textContent = rework;
        selectElement2.appendChild(option);
      }
    }, 100);


  });


// on clicking submit date button

document.getElementById('submitDate').addEventListener('click', function(){
  reworkTypeSelected = document.getElementById('reworkTypeDynamicSelect').value;
  productSelected = document.getElementById('productDynamicSelect').value;

  const startDate = document.getElementById('dateStart').value.trim().toLowerCase();
  const endDate = document.getElementById('dateEnd').value.trim().toLowerCase();

  const start = startDate.substring(5).replace(/-/g, '/');
  const end = endDate.substring(5).replace(/-/g,'/'); 

  const filteredAOI = filterCSV(AOIdata, start, end, reworkTypeSelected, productSelected);
  displayData(filteredAOI);
  const filteredVI = filterCSV(VIdata, start, end, reworkTypeSelected, productSelected);
  displayData2(filteredVI);

  // filterTable after timeout because displayData is not yet finished while we call filterTable.

  setTimeout(() => {
    filterTable(searchInput);
  }, 100);
}); 

document.getElementById('updateShow').addEventListener('click', function(event) {
  showOnly = document.getElementById('showOnly').value;
  filterTable(searchInput);
});

function filterTable(searchInput) {

  if (searchInput.trim() === '') {
    table.search('').draw();
    updateChart(table.data().toArray());
    table2.search('').draw();
    updateChart2(table2.data().toArray());
  }

  else{
    table.search(searchInput).draw();
    updateChart(table.rows({ search: 'applied' }).data().toArray());
    table2.search(searchInput).draw();
    updateChart2(table2.rows({ search: 'applied' }).data().toArray());
  }

  return;
}

function updateChart(data) {
  const ctx = document.getElementById('chart').getContext('2d');
  const column4Data = data.map(row => row['ReWork Type']);
  const uniqueValues = [...new Set(column4Data)];
  const valueCounts = uniqueValues.map(value => {
    const count = column4Data.filter(v => v === value).length;
    return { value, count };
  });

  valueCounts.sort((a, b) => b.count - a.count);
  firstNvalueCounts = valueCounts.slice(0,showOnly);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: firstNvalueCounts.map(item => item.value),
      datasets: [{
        label: 'ReWork Type',
        data: firstNvalueCounts.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });

  // Update the second chart (column 5 - Component Reference)
  const ctx2 = document.getElementById('chart2').getContext('2d');
  const column5Data = data.map(row => row['Component Ref']);
  const uniqueValues2 = [...new Set(column5Data)];
  const valueCounts2 = uniqueValues2.map(value => {
    const count = column5Data.filter(v => v === value).length;
    return { value, count };
  });

  valueCounts2.sort((a, b) => b.count - a.count);
  firstNvalueCounts = valueCounts2.slice(0,showOnly);

  if (chart2) {
    chart2.destroy();
  }

  chart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: firstNvalueCounts.map(item => item.value),
      datasets: [{
        label: 'Component Ref',
        data: firstNvalueCounts.map(item => item.count),
        backgroundColor: 'rgba(192, 75, 75, 0.6)',
        borderColor: 'rgba(192, 75, 75, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });
  const ctx3 = document.getElementById('chart3').getContext('2d');
  const column3Data = data.map(row => row['Product']);
  const uniqueValues3 = [...new Set(column3Data)];
  const valueCounts3 = uniqueValues3.map(value => {
    const rows = data.filter(row => (row['Product'] == value));
    const boardData = rows.map(row => row['Board No']);
    const uniqueBoards = [...new Set(boardData)];
    count = uniqueBoards.length;
    return { value, count };
  });

  valueCounts3.sort((a, b) => b.count - a.count);
  firstNvalueCounts = valueCounts3.slice(0,showOnly);

  if (chart3) {
    chart3.destroy();
  }

  chart3 = new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: firstNvalueCounts.map(item => item.value),
      datasets: [{
        label: 'Product',
        data: firstNvalueCounts.map(item => item.count),
        backgroundColor: 'rgba(255, 125, 24, 0.6)',
        borderColor: 'rgba(255, 125, 24, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });
}

function updateChart2(data) {
  const ctx = document.getElementById('chart4').getContext('2d');
  const column4Data = data.map(row => row['ReWork Type']);
  const uniqueValues = [...new Set(column4Data)];
  const valueCounts = uniqueValues.map(value => {
    const count = column4Data.filter(v => v === value).length;
    return { value, count };
  });

  valueCounts.sort((a, b) => b.count - a.count);
  firstNvalueCounts = valueCounts.slice(0,showOnly);

  if (chart4) {
    chart4.destroy();
  }

  chart4 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: firstNvalueCounts.map(item => item.value),
      datasets: [{
        label: 'ReWork Type',
        data: firstNvalueCounts.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });

  // Update the second chart (column 5 - Component Reference)
  const ctx2 = document.getElementById('chart5').getContext('2d');
  const column5Data = data.map(row => row['Component Ref']);
  const uniqueValues2 = [...new Set(column5Data)];
  const valueCounts2 = uniqueValues2.map(value => {
    const count = column5Data.filter(v => v === value).length;
    return { value, count };
  });

  valueCounts2.sort((a, b) => b.count - a.count);
  firstNvalueCounts = valueCounts2.slice(0,showOnly);

  if (chart5) {
    chart5.destroy();
  }

  chart5 = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: firstNvalueCounts.map(item => item.value),
      datasets: [{
        label: 'Component Ref',
        data: firstNvalueCounts.map(item => item.count),
        backgroundColor: 'rgba(192, 75, 75, 0.6)',
        borderColor: 'rgba(192, 75, 75, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });
  const ctx3 = document.getElementById('chart6').getContext('2d');
  const column3Data = data.map(row => row['Product']);
  const uniqueValues3 = [...new Set(column3Data)];
  const valueCounts3 = uniqueValues3.map(value => {
    const rows = data.filter(row => (row['Product'] == value));
    const boardData = rows.map(row => row['Board No']);
    const uniqueBoards = [...new Set(boardData)];
    count = uniqueBoards.length;
    return { value, count };
  });

  valueCounts3.sort((a, b) => b.count - a.count);
  firstNvalueCounts = valueCounts3.slice(0,showOnly);

  if (chart6) {
    chart6.destroy();
  }

  chart6 = new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: firstNvalueCounts.map(item => item.value),
      datasets: [{
        label: 'Product',
        data: firstNvalueCounts.map(item => item.count),
        backgroundColor: 'rgba(255, 125, 24, 0.6)',
        borderColor: 'rgba(255, 125, 24, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });
}


function displayData(data) {
  // document.getElementById('fname').textContent = file.name;
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '';

  // Create table
  const tableElement = document.createElement('table');
  tableElement.id = 'csvTable';
  tableElement.classList.add('display');
  outputDiv.appendChild(tableElement);

  table = $(tableElement).DataTable({
    data: data,
    columns: Object.keys(data[0]).map(function(column) {
      return { title: column, data: column };
    }),
    lengthChange: true,
    searching: true,
  });

  // Create initial chart for column 4 (ReWork Type)
  const ctx = document.getElementById('chart').getContext('2d');
  const column4Data = data.map(row => row['ReWork Type']);
  const uniqueValues = [...new Set(column4Data)];
  reworkArray = uniqueValues;

  const valueCounts = uniqueValues.map(value => {
    const count = column4Data.filter(v => v === value).length;
    return { value, count };
  });

  valueCounts.sort((a, b) => b.count - a.count);
  firstNvalueCounts = valueCounts.slice(0,5);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: firstNvalueCounts.map(item => item.value),
      datasets: [{
        label: 'ReWork Type',
        data: firstNvalueCounts.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        },
        x: {
          
        }
      }
    }
  });

  // Create another chart for column 5 (Component Reference)
  const ctx2 = document.getElementById('chart2').getContext('2d');
  const column5Data = data.map(row => row['Component Ref']);
  const uniqueValues2 = [...new Set(column5Data)];
  const valueCounts2 = uniqueValues2.map(value => {
    const count = column5Data.filter(v => v === value).length;
    return { value, count };
  });

  valueCounts2.sort((a, b) => b.count - a.count);
  firstNvalueCounts = valueCounts2.slice(0,5);

  if (chart2) {
    chart2.destroy();
  }

  chart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: firstNvalueCounts.map(item => item.value),
      datasets: [{
        label: 'Component Ref',
        data: firstNvalueCounts.map(item => item.count),
        backgroundColor: 'rgba(192, 75, 75, 0.6)',
        borderColor: 'rgba(192, 75, 75, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });


  const ctx3 = document.getElementById('chart3').getContext('2d');
  const column3Data = data.map(row => row['Product']);
  const uniqueValues3 = [...new Set(column3Data)];
  productArray = uniqueValues3;

  const valueCounts3 = uniqueValues3.map(value => {
    const rows = data.filter(row => (row['Product'] == value));
    const boardData = rows.map(row => row['Board No']);
    const uniqueBoards = [...new Set(boardData)];
    // console.log(uniqueBoards);
    count = uniqueBoards.length;
    return { value, count };
  });

  valueCounts3.sort((a, b) => b.count - a.count);
  firstNvalueCounts = valueCounts3.slice(0,5);

  if (chart3) {
    chart3.destroy();
  }

  chart3 = new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: firstNvalueCounts.map(item => item.value),
      datasets: [{
        label: 'Product',
        data: firstNvalueCounts.map(item => item.count),
        backgroundColor: 'rgba(255, 125, 24, 0.6)',
        borderColor: 'rgba(255, 125, 24, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: ({
          beginAtZero: true,
          stepSize: 1
        })
      }
    }
  });
}

function displayData2(data) {
  // document.getElementById('fname2').textContent = file2.name;
  const outputDiv = document.getElementById('output2');
  outputDiv.innerHTML = '';

  // Create table
  const tableElement = document.createElement('table');
  tableElement.id = 'csvTable';
  tableElement.classList.add('display');
  outputDiv.appendChild(tableElement);

  table2 = $(tableElement).DataTable({
    data: data,
    columns: Object.keys(data[0]).map(function(column) {
      return { title: column, data: column };
    }),
    lengthChange: true,
    searching: true,
  });

  // Create initial chart for column 4 (ReWork Type)
  const ctx = document.getElementById('chart4').getContext('2d');
  const column4Data = data.map(row => row['ReWork Type']);
  const uniqueValues = [...new Set(column4Data)];
  reworkArray2 = uniqueValues;

  const valueCounts = uniqueValues.map(value => {
    const count = column4Data.filter(v => v === value).length;
    return { value, count };
  });

  valueCounts.sort((a, b) => b.count - a.count);
  firstNvalueCounts = valueCounts.slice(0,5);

  if (chart4) {
    chart4.destroy();
  }

  chart4 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: firstNvalueCounts.map(item => item.value),
      datasets: [{
        label: 'ReWork Type',
        data: firstNvalueCounts.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });

  // Create another chart for column 5 (Component Reference)
  const ctx2 = document.getElementById('chart5').getContext('2d');
  const column5Data = data.map(row => row['Component Ref']);
  const uniqueValues2 = [...new Set(column5Data)];
  const valueCounts2 = uniqueValues2.map(value => {
    const count = column5Data.filter(v => v === value).length;
    return { value, count };
  });

  valueCounts2.sort((a, b) => b.count - a.count);
  firstNvalueCounts = valueCounts2.slice(0,5);

  if (chart5) {
    chart5.destroy();
  }

  chart5 = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: firstNvalueCounts.map(item => item.value),
      datasets: [{
        label: 'Component Ref',
        data: firstNvalueCounts.map(item => item.count),
        backgroundColor: 'rgba(192, 75, 75, 0.6)',
        borderColor: 'rgba(192, 75, 75, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });


  const ctx3 = document.getElementById('chart6').getContext('2d');
  const column3Data = data.map(row => row['Product']);
  const uniqueValues3 = [...new Set(column3Data)];
  productArray2 = uniqueValues3;
  const valueCounts3 = uniqueValues3.map(value => {
    const rows = data.filter(row => (row['Product'] == value));
    const boardData = rows.map(row => row['Board No']);
    const uniqueBoards = [...new Set(boardData)];
    count = uniqueBoards.length;
    return { value, count };
  });

  valueCounts3.sort((a, b) => b.count - a.count);

  if (chart6) {
    chart6.destroy();
  }

  chart6 = new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: valueCounts3.map(item => item.value),
      datasets: [{
        label: 'Product',
        data: valueCounts3.map(item => item.count),
        backgroundColor: 'rgba(255, 125, 24, 0.6)',
        borderColor: 'rgba(255, 125, 24, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });
}

function filterCSV(data, startValue, endValue, reworkType, product) {
  return data.filter((row) => (
    
    (
      (startValue == '')
      ||
    (row['Date and Time'] >= startValue && row['Date and Time'] <= endValue) 
  || (
    (row['Date and Time'] >= startValue.substring(1))
  && (row['Date and Time'] <= endValue.substring(1)) 
  && (row['Date and Time'].charAt(2) !== '/') 
  && (startValue.substring(0,2) < '10' 
  && startValue.substring(0,2)> '00')
    )
  )

  &&

  (
    (reworkType == '')
    ||
    (row['ReWork Type'] == reworkType)
  )

  &&

  (
    (product == '')
    ||
    (row['Product'] == product)
  )
)

);
}

document.getElementById('export').addEventListener('click', function() {
  html2canvas(document.getElementById('content'), {
      onrendered: function(canvas) {
          var imgData = canvas.toDataURL('image/jpeg');
          var link = document.createElement('a');
          link.href = imgData;
          link.download = 'Defect_Analysis.jpg';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  });
});