let originalData = [];
let columns = [];
let selectedOption = '';
let selectedColumn = '';
let splitResults = {};

// File upload handling
document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('dropZone').addEventListener('dragover', handleDragOver);
document.getElementById('dropZone').addEventListener('drop', handleFileDrop);

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.background = 'rgba(67, 97, 238, 0.15)';
}

function handleFileDrop(e) {
    e.preventDefault();
    e.currentTarget.style.background = 'rgba(67, 97, 238, 0.05)';
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) processFile(file);
}

function processFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        originalData = XLSX.utils.sheet_to_json(firstSheet);
        
        if (originalData.length > 0) {
            columns = Object.keys(originalData[0]);
            showPreview();
            showOptions();
        }
    };
    reader.readAsArrayBuffer(file);
}

function showPreview() {
    // Show preview section
    document.getElementById('previewSection').style.display = 'block';
    
    // Update stats
    document.getElementById('totalRows').textContent = originalData.length;
    document.getElementById('totalColumns').textContent = columns.length;
    
    // Show first 5 rows in preview
    const headerRow = columns.map(col => `<th>${col}</th>`).join('');
    document.getElementById('previewHeader').innerHTML = `<tr>${headerRow}</tr>`;
    
    const previewBody = originalData.slice(0, 5).map(row => {
        const rowData = columns.map(col => `<td>${row[col] || ''}</td>`).join('');
        return `<tr>${rowData}</tr>`;
    }).join('');
    
    document.getElementById('previewBody').innerHTML = previewBody;
}

function showOptions() {
    document.getElementById('optionsSection').style.display = 'block';
}

function selectOption(option) {
    selectedOption = option;
    
    // Update UI
    document.querySelectorAll('.split-option').forEach(el => el.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    // Show column selection
    document.getElementById('columnSection').style.display = 'block';
    
    // Populate columns
    const columnSelect = document.getElementById('columnSelect');
    columnSelect.innerHTML = '<option value="">Choose a column...</option>';
    columns.forEach(col => {
        const option = document.createElement('option');
        option.value = col;
        option.textContent = col;
        columnSelect.appendChild(option);
    });
    
    // Enable split button when column is selected
    columnSelect.onchange = function() {
        selectedColumn = this.value;
        document.getElementById('splitBtn').disabled = !selectedColumn;
        
        // Update unique values count
        if (selectedColumn) {
            const uniqueValues = new Set(originalData.map(row => {
                if (selectedOption === 'months' && row[selectedColumn]) {
                    return extractMonth(row[selectedColumn]);
                }
                return row[selectedColumn];
            })).size;
            document.getElementById('uniqueValues').textContent = uniqueValues;
        }
    };
}

function extractMonth(dateValue) {
    if (!dateValue) return 'Unknown';
    
    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        return date.toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
        });
    } catch (e) {
        return 'Invalid Date';
    }
}

function splitData() {
    if (!selectedOption || !selectedColumn || originalData.length === 0) return;
    
    // Show loading
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    
    // Simulate processing delay for better UX
    setTimeout(() => {
        performSplit();
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        showResults();
    }, 1500);
}

function performSplit() {
    splitResults = {};
    
    originalData.forEach(row => {
        let key;
        
        if (selectedOption === 'months') {
            key = extractMonth(row[selectedColumn]);
        } else {
            key = row[selectedColumn] || 'Unknown';
        }
        
        if (!splitResults[key]) {
            splitResults[key] = [];
        }
        
        splitResults[key].push(row);
    });
}

function showResults() {
    const sheetList = document.getElementById('sheetList');
    sheetList.innerHTML = '';
    
    Object.keys(splitResults).forEach(sheetName => {
        const count = splitResults[sheetName].length;
        const sheetItem = document.createElement('div');
        sheetItem.className = 'sheet-item';
        sheetItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${sheetName}</h6>
                    <small class="text-muted">${count} records</small>
                </div>
                <span class="badge bg-primary">${count}</span>
            </div>
        `;
        sheetList.appendChild(sheetItem);
    });
}

function downloadExcel() {
    // Create new workbook
    const workbook = XLSX.utils.book_new();
    
    // Add each split as a separate sheet
    Object.keys(splitResults).forEach(sheetName => {
        const worksheet = XLSX.utils.json_to_sheet(splitResults[sheetName]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.substring(0, 31)); // Sheet names max 31 chars
    });
    
    // Add original data as well
    const originalWorksheet = XLSX.utils.json_to_sheet(originalData);
    XLSX.utils.book_append_sheet(workbook, originalWorksheet, 'Original Data');
    
    // Download
    const fileName = `split_data_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
}