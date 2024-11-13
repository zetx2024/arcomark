let studentData = [];

// Handle the file upload
document.getElementById("excel-file").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });

            // Assume data is in the first sheet
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert sheet to JSON
            studentData = XLSX.utils.sheet_to_json(sheet);
            console.log(studentData);  // Log data to inspect the structure
        };

        reader.readAsBinaryString(file);
    }
});

// Generate JSON when button is clicked
document.getElementById("generate-btn").addEventListener("click", function () {
    const category = document.getElementById("category").value.trim();
    const year = document.getElementById("year").value.trim();

    if (!category || !year) {
        alert("Please enter both Category and Year.");
        return;
    }

    if (!studentData.length) {
        alert("Please upload an Excel file first.");
        return;
    }

    // Use the uploaded data to generate the JSON for a new student
    const student = studentData[0]; // Taking the first student, you can adjust this if needed

    // Generate random Student ID
    const studentId = generateStudentId();

    // Display the generated Student ID
    document.getElementById("student-id").textContent = studentId;

    // Prepare the student data for JSON
    const studentJson = {
        student_id: studentId,
        name: student.Name || "Unknown",  // Replace with dynamic data
        institution: student.Institution || "Unknown",  // Replace with dynamic data
        category: category,
        year: year,
        research_proposal_title: student["Research Proposal Title"] || "Unknown",  // Replace with dynamic data
        research_paper: {
            research_problem: student["Research Problem"] || 0,
            existing_literature: student["Existing Literature"] || 0,
            research_question: student["Research Question"] || 0,
            methodology: student["Methodology"] || 0,
            research_topic: student["Research Topic"] || 0,
            quality_of_writing: student["Quality of Writing"] || 0,
            plagiarism_check_percentile: student["Plagiarism Check Percentile"] || 0,
            presentation: {
                persuasiveness: student["Persuasiveness"] || 0,
                video_quality: student["Video Quality"] || 0,
                research_problem: student["Research Problem (Presentation)"] || 0,
                research_question: student["Research Question (Presentation)"] || 0,
                methodology: student["Methodology (Presentation)"] || 0
            }
        }
    };

    // Display the JSON in the <pre> tag
    document.getElementById("json-output").textContent = JSON.stringify(studentJson, null, 2);
});

// Function to generate a random Student ID
function generateStudentId() {
    const characters = 'aAzZ1234567890';
    let studentId = '';
    for (let i = 0; i < 10; i++) {
        const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
        studentId += randomChar;
    }
    return studentId;
}

// Copy to clipboard functionality
document.getElementById("copy-btn").addEventListener("click", function () {
    const jsonOutput = document.getElementById("json-output");
    const range = document.createRange();
    range.selectNode(jsonOutput);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert("JSON copied to clipboard!");
        } else {
            alert("Failed to copy JSON.");
        }
    } catch (err) {
        console.error('Error copying text: ', err);
    }

    // Deselect text
    window.getSelection().removeAllRanges();
});
