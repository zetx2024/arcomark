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

    const allStudentsJson = [];

    // Loop through all students and generate JSON for each student
    studentData.forEach(student => {
        const studentJson = {
            student_id: generateStudentId(), // Generate random Student ID
            name: student.Name || "Unknown",
            institution: student.Institution || "Unknown",
            category: category,
            year: year,
            research_proposal_title: student["Research Proposal Title"] || "Unknown",
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

        allStudentsJson.push(studentJson);
    });

    // Display the generated JSON for all students
    document.getElementById("json-output").textContent = JSON.stringify(allStudentsJson, null, 2);
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

// Download JSON file functionality
document.getElementById("download-btn").addEventListener("click", function () {
    const jsonOutput = document.getElementById("json-output").textContent;
    if (!jsonOutput) {
        alert("No JSON data to download.");
        return;
    }

    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "students_data.json";
    link.click();
});
