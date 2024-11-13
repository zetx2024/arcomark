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
    const category = document.getElementById("category").value;
    const year = document.getElementById("year").value;

    if (!studentData.length) {
        alert("Please upload an Excel file first.");
        return;
    }

    // Filter the student data by category and year
    const filteredData = studentData.filter(student => student.Category === category && student.Year === year);

    if (filteredData.length === 0) {
        alert("No data found for the selected Category and Year.");
        return;
    }

    // Select the first student (you could modify this to handle multiple students)
    const student = filteredData[0];

    // Generate random Student ID
    const studentId = generateStudentId();

    // Display the generated Student ID
    document.getElementById("student-id").textContent = studentId;

    // Prepare the student data for JSON
    const studentJson = {
        student_id: studentId,
        name: student.Name,
        institution: student.Institution,
        category: student.Category,
        year: student.Year,
        research_proposal_title: student["Research Proposal Title"],
        research_paper: {
            research_problem: student["Research Problem"],
            existing_literature: student["Existing Literature"],
            research_question: student["Research Question"],
            methodology: student["Methodology"],
            research_topic: student["Research Topic"],
            quality_of_writing: student["Quality of Writing"],
            plagiarism_check_percentile: student["Plagiarism Check Percentile"],
            presentation: {
                persuasiveness: student["Persuasiveness"],
                video_quality: student["Video Quality"],
                research_problem: student["Research Problem (Presentation)"],
                research_question: student["Research Question (Presentation)"],
                methodology: student["Methodology (Presentation)"]
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
