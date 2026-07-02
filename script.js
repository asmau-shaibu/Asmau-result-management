// ============================================================
// DATA LAYER – localStorage
// ============================================================
const DB = {
    get: function(key, defaultVal) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultVal;
    },
    set: function(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }
};

function getUsers() { return DB.get('users', []); }
function getStudents() { return DB.get('students', []); }
function getLecturers() { return DB.get('lecturers', []); }
function getCourses() { return DB.get('courses', []); }
function getEnrollments() { return DB.get('enrollments', []); }
function getGrades() { return DB.get('grades', []); }

function saveUsers(u) { DB.set('users', u); }
function saveStudents(s) { DB.set('students', s); }
function saveLecturers(l) { DB.set('lecturers', l); }
function saveCourses(c) { DB.set('courses', c); }
function saveEnrollments(e) { DB.set('enrollments', e); }
function saveGrades(g) { DB.set('grades', g); }

function generateId(arr) {
    return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
}

function getGradePoint(grade) {
    const map = { 'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'F': 0.0 };
    return map[grade] || 0;
}

function getLetterGrade(total) {
    if (total >= 70) return 'A';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    if (total >= 45) return 'D';
    return 'F';
}

// ============================================================
// INITIALISE MOCK DATA – WITH YOUR PERSONALISED DATA
// ============================================================
function initData() {
    // --- USERS (ADMIN, LECTURERS, STUDENTS) ---
    if (!localStorage.getItem('users')) {
        const users = [
            // DEFAULT ADMIN
            { id: 1, email: 'shaibuasmau@gmail.com', password: 'ADMIN', role: 'admin', studentId: null, lecturerId: null },
            
            // DEFAULT LECTURERS
            { id: 2, email: 'awal@gmail.com', password: '101010', role: 'lecturer', studentId: null, lecturerId: 1 },
            { id: 3, email: 'sediq@gmail.com', password: '101010', role: 'lecturer', studentId: null, lecturerId: 2 },
            
            // DEFAULT STUDENTS
            { id: 4, email: 'shaibumariam@gmail.com', password: '101010', role: 'student', studentId: 1, lecturerId: null },
            { id: 5, email: 'shaibuaishat@gmail.com', password: '101010', role: 'student', studentId: 2, lecturerId: null }
        ];
        saveUsers(users);
    }

    // --- STUDENTS ---
    if (!localStorage.getItem('students')) {
        const students = [
            { id: 1, name: 'Shaibu Mariam', email: 'shaibumariam@gmail.com', program: 'Computer Science', level: 'ND1' },
            { id: 2, name: 'Shaibu Aishat', email: 'shaibuaishat@gmail.com', program: 'Computer Science', level: 'ND1' }
        ];
        saveStudents(students);
    }

    // --- LECTURERS ---
    if (!localStorage.getItem('lecturers')) {
        const lecturers = [
            { id: 1, name: 'Muhammed Awal', email: 'awal@gmail.com', department: 'Computer Science' },
            { id: 2, name: 'Shaibu Sediq', email: 'sediq@gmail.com', department: 'Computer Science' }
        ];
        saveLecturers(lecturers);
    }

    // --- COURSES (Default ND Courses) ---
    if (!localStorage.getItem('courses')) {
        const courses = [
            { id: 1, code: 'CSC101', title: 'Introduction to Programming', credit: 3, lecturerId: 1 },
            { id: 2, code: 'CSS102', title: 'Computer Systems & Architecture', credit: 3, lecturerId: 1 },
            { id: 3, code: 'CSC104', title: 'Data Structures & Algorithms', credit: 3, lecturerId: 2 },
            { id: 4, code: 'CSC108', title: 'Object-Oriented Programming', credit: 3, lecturerId: 2 }
        ];
        saveCourses(courses);
    }

    // --- ENROLLMENTS ---
    if (!localStorage.getItem('enrollments')) {
        const enrollments = [
            { id: 1, studentId: 1, courseId: 1, session: '2024/2025', semester: 1 },
            { id: 2, studentId: 1, courseId: 2, session: '2024/2025', semester: 1 },
            { id: 3, studentId: 2, courseId: 1, session: '2024/2025', semester: 1 },
            { id: 4, studentId: 2, courseId: 3, session: '2024/2025', semester: 1 }
        ];
        saveEnrollments(enrollments);
    }

    // --- GRADES (Sample results) ---
    if (!localStorage.getItem('grades')) {
        const grades = [
            { id: 1, studentId: 1, courseId: 1, test: 18, exam: 60, total: 78, grade: 'A', gp: 5.0, status: 'approved', courseCode: 'CSC101', courseTitle: 'Introduction to Programming', credit: 3 },
            { id: 2, studentId: 1, courseId: 2, test: 12, exam: 40, total: 52, grade: 'C', gp: 3.0, status: 'approved', courseCode: 'CSS102', courseTitle: 'Computer Systems & Architecture', credit: 3 },
            { id: 3, studentId: 2, courseId: 1, test: 10, exam: 45, total: 55, grade: 'C', gp: 3.0, status: 'submitted', courseCode: 'CSC101', courseTitle: 'Introduction to Programming', credit: 3 }
        ];
        saveGrades(grades);
    }
}
initData();

// ============================================================
// GLOBAL MODAL HELPERS
// ============================================================
function showSuccessModal(title, message) {
    document.getElementById('successModalTitle').textContent = title || 'Success';
    document.getElementById('successModalMessage').textContent = message || 'Operation completed successfully.';
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

function showErrorModal(title, message) {
    document.getElementById('errorModalTitle').textContent = title || 'Error';
    document.getElementById('errorModalMessage').textContent = message || 'An error occurred.';
    const modal = new bootstrap.Modal(document.getElementById('errorModal'));
    modal.show();
}

function showConfirmModal(title, message, onConfirm) {
    document.getElementById('confirmModalTitle').textContent = title || 'Confirm';
    document.getElementById('confirmModalMessage').textContent = message || 'Are you sure?';
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    const yesBtn = document.getElementById('confirmModalYesBtn');
    const newYesBtn = yesBtn.cloneNode(true);
    yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
    newYesBtn.addEventListener('click', function() {
        modal.hide();
        if (typeof onConfirm === 'function') onConfirm();
    });
    modal.show();
}

// ============================================================
// PAGE HANDLERS – DOM READY
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    // --- LOGIN PAGE ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        emailInput.addEventListener('input', function() {
            const valid = this.value.trim() !== '' && this.checkValidity();
            this.classList.toggle('is-invalid', !valid);
        });
        passwordInput.addEventListener('input', function() {
            this.classList.toggle('is-invalid', this.value.trim() === '');
        });
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted');
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const role = document.getElementById('role').value;
            
            if (!email || !password) {
                showLoginError('Please fill in both email and password.');
                return;
            }
            if (!emailInput.checkValidity()) {
                showLoginError('Please enter a valid email address.');
                return;
            }
            
            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password && u.role === role);
            
            if (!user) {
                showLoginError('Invalid email, password, or role. Please try again.');
                return;
            }
            
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        });
    }

    // --- REGISTRATION PAGE ---
    const regForm = document.getElementById('registerForm');
    if (regForm) {
        console.log('Registration form found');
        const regName = document.getElementById('regName');
        const regEmail = document.getElementById('regEmail');
        const regPassword = document.getElementById('regPassword');
        const regConfirm = document.getElementById('regConfirmPassword');
        const regProgram = document.getElementById('regProgram');
        const regLevel = document.getElementById('regLevel');
        const courseArea = document.getElementById('courseSelectionArea');
        
        // --- FUNCTION TO LOAD COURSES ---
        function loadCoursesForRegistration() {
            console.log('Loading courses for registration...');
            const courses = getCourses();
            console.log('Courses found:', courses);
            if (!courseArea) {
                console.warn('courseSelectionArea not found!');
                return;
            }
            if (courses.length === 0) {
                courseArea.innerHTML = '<p class="text-muted small text-center my-2">No courses available. Please contact admin.</p>';
                return;
            }
            let html = '';
            courses.forEach(c => {
                html += `
                    <div class="form-check">
                        <input class="form-check-input course-checkbox" type="checkbox" value="${c.id}" id="course_${c.id}">
                        <label class="form-check-label small" for="course_${c.id}">
                            <strong>${c.code}</strong> - ${c.title} (${c.credit} CU)
                        </label>
                    </div>
                `;
            });
            courseArea.innerHTML = html;
            console.log('Courses loaded successfully.');
        }
        
        // Load courses when page loads
        loadCoursesForRegistration();
        
        // ---- Live validation ----
        regName.addEventListener('input', function() {
            this.classList.toggle('is-invalid', this.value.trim() === '');
        });
        regEmail.addEventListener('input', function() {
            const valid = this.value.trim() !== '' && this.checkValidity();
            this.classList.toggle('is-invalid', !valid);
        });
        regPassword.addEventListener('input', function() {
            this.classList.toggle('is-invalid', this.value.length < 6);
            if (regConfirm.value) {
                regConfirm.classList.toggle('is-invalid', regConfirm.value !== this.value);
            }
        });
        regConfirm.addEventListener('input', function() {
            this.classList.toggle('is-invalid', this.value !== regPassword.value);
        });
        regProgram.addEventListener('input', function() {
            this.classList.toggle('is-invalid', this.value.trim() === '');
        });
        
        // ✅ FIX: Level validation – remove invalid class on change
        regLevel.addEventListener('change', function() {
            if (this.value !== '') {
                this.classList.remove('is-invalid');
            } else {
                this.classList.add('is-invalid');
            }
        });
        
        // ---- Submit ----
        regForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Registration form submitted');
            const name = regName.value.trim();
            const email = regEmail.value.trim();
            const password = regPassword.value;
            const confirm = regConfirm.value;
            const program = regProgram.value.trim();
            const level = regLevel.value;
            
            // Get selected courses
            const selectedCourses = [];
            document.querySelectorAll('.course-checkbox:checked').forEach(cb => {
                selectedCourses.push(parseInt(cb.value));
            });
            
            // Validate
            if (!name || !email || !program || !level) {
                showRegisterError('All fields are required.');
                return;
            }
            if (!regEmail.checkValidity()) {
                showRegisterError('Please enter a valid email address.');
                return;
            }
            if (password.length < 6) {
                showRegisterError('Password must be at least 6 characters.');
                return;
            }
            if (password !== confirm) {
                showRegisterError('Passwords do not match.');
                return;
            }
            if (selectedCourses.length === 0) {
                showRegisterError('Please select at least one course.');
                return;
            }
            
            const users = getUsers();
            if (users.find(u => u.email === email)) {
                showRegisterError('This email is already registered. Please login.');
                return;
            }
            
            // Create student
            const students = getStudents();
            const newSid = generateId(students);
            students.push({ id: newSid, name, email, program, level });
            saveStudents(students);
            
            // Create user account
            users.push({
                id: generateId(users),
                email,
                password,
                role: 'student',
                studentId: newSid,
                lecturerId: null
            });
            saveUsers(users);
            
            // Enroll student in selected courses
            const enrollments = getEnrollments();
            selectedCourses.forEach(courseId => {
                enrollments.push({
                    id: generateId(enrollments),
                    studentId: newSid,
                    courseId: courseId,
                    session: '2024/2025',
                    semester: 1
                });
            });
            saveEnrollments(enrollments);
            
            console.log('Student registered:', email, 'with courses:', selectedCourses);
            
            const successModal = new bootstrap.Modal(document.getElementById('registerSuccessModal'));
            successModal.show();
            
            document.getElementById('regSuccessRedirectBtn').addEventListener('click', function() {
                sessionStorage.setItem('currentUser', JSON.stringify({ 
                    email, 
                    role: 'student', 
                    studentId: newSid, 
                    lecturerId: null 
                }));
                window.location.href = 'dashboard.html';
            });
        });
    }

    // --- DASHBOARD PAGE ---
    if (window.location.pathname.includes('dashboard.html')) {
        console.log('Dashboard page detected');
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        console.log('Current user:', currentUser);
        
        if (!currentUser) {
            console.warn('No user session found, redirecting to login');
            window.location.href = 'index.html';
            return;
        }
        
        renderDashboard(currentUser);
        
        document.getElementById('logoutBtn').addEventListener('click', function() {
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
        
        const addCourseModal = document.getElementById('addCourseModal');
        if (addCourseModal) {
            addCourseModal.addEventListener('show.bs.modal', function() {
                populateCourseLecturerDropdown();
            });
        }
        const enrollModal = document.getElementById('enrollStudentModal');
        if (enrollModal) {
            enrollModal.addEventListener('show.bs.modal', function() {
                populateEnrollDropdowns();
            });
        }
    }
});

// ============================================================
// HELPER FUNCTIONS FOR LOGIN/REGISTRATION MODALS
// ============================================================
function showLoginError(msg) {
    document.getElementById('loginErrorMessage').textContent = msg;
    const modal = new bootstrap.Modal(document.getElementById('loginErrorModal'));
    modal.show();
}

function showRegisterError(msg) {
    document.getElementById('registerErrorMessage').textContent = msg;
    const modal = new bootstrap.Modal(document.getElementById('registerErrorModal'));
    modal.show();
}

// ============================================================
// POPULATE DROPDOWNS FOR MODALS
// ============================================================
function populateCourseLecturerDropdown() {
    const select = document.getElementById('courseLecturerSelect');
    if (!select) return;
    const lecturers = getLecturers();
    select.innerHTML = '<option value="">-- Select Lecturer --</option>';
    lecturers.forEach(l => {
        select.innerHTML += `<option value="${l.id}">${l.name} (${l.department})</option>`;
    });
}

function populateEnrollDropdowns() {
    const studentSelect = document.getElementById('enrollStudentSelect');
    const courseSelect = document.getElementById('enrollCourseSelect');
    if (!studentSelect || !courseSelect) return;
    const students = getStudents();
    const courses = getCourses();
    
    studentSelect.innerHTML = '<option value="">-- Select Student --</option>';
    students.forEach(s => {
        studentSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.program})</option>`;
    });
    
    courseSelect.innerHTML = '<option value="">-- Select Course --</option>';
    courses.forEach(c => {
        courseSelect.innerHTML += `<option value="${c.id}">${c.code} - ${c.title}</option>`;
    });
}

// ============================================================
// DASHBOARD RENDER FUNCTIONS
// ============================================================

function renderDashboard(user) {
    console.log('Rendering dashboard for:', user);
    if (!user) return;

    let displayName = user.email;
    if (user.role === 'student') {
        const students = getStudents();
        const s = students.find(st => st.id === user.studentId);
        if (s) displayName = s.name;
    } else if (user.role === 'lecturer') {
        const lecturers = getLecturers();
        const l = lecturers.find(lec => lec.id === user.lecturerId);
        if (l) displayName = l.name;
    } else if (user.role === 'admin') {
        displayName = 'Admin';
    }
    document.getElementById('userName').textContent = displayName;

    document.getElementById('studentView').classList.add('d-none');
    document.getElementById('lecturerView').classList.add('d-none');
    document.getElementById('adminView').classList.add('d-none');

    if (user.role === 'student') {
        document.getElementById('studentView').classList.remove('d-none');
        renderStudentView(user);
    } else if (user.role === 'lecturer') {
        document.getElementById('lecturerView').classList.remove('d-none');
        renderLecturerView(user);
    } else if (user.role === 'admin') {
        document.getElementById('adminView').classList.remove('d-none');
        renderAdminView();
        
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) settingsBtn.style.display = 'inline-block';
        
        loadAdminSettings();
    } else {
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) settingsBtn.style.display = 'none';
    }
}

// ---- STUDENT ----
function renderStudentView(user) {
    const students = getStudents();
    const student = students.find(s => s.id === user.studentId);
    if (!student) {
        document.getElementById('studentProfile').innerHTML = '<p class="text-danger">Student profile not found.</p>';
        return;
    }

    document.getElementById('studentProfile').innerHTML = `
        <p><strong>Name:</strong> ${student.name}</p>
        <p><strong>Email:</strong> ${student.email}</p>
        <p><strong>Program:</strong> ${student.program}</p>
        <p><strong>Level:</strong> ${student.level}</p>
        <p><strong>Student ID:</strong> ${student.id}</p>
    `;

    const hasResults = renderStudentResults(student.id);
    updateInfoCard(student.id, hasResults);

    const refreshBtn = document.getElementById('refreshResultsBtn');
    if (refreshBtn) {
        const newRefreshBtn = refreshBtn.cloneNode(true);
        refreshBtn.parentNode.replaceChild(newRefreshBtn, refreshBtn);
        newRefreshBtn.addEventListener('click', function() {
            const has = renderStudentResults(student.id);
            updateInfoCard(student.id, has);
        });
    }

    const transcriptBtn = document.getElementById('generateTranscriptBtn');
    if (transcriptBtn) {
        const newTranscriptBtn = transcriptBtn.cloneNode(true);
        transcriptBtn.parentNode.replaceChild(newTranscriptBtn, transcriptBtn);
        newTranscriptBtn.addEventListener('click', function() {
            generateTranscript(student.id);
        });
    }
}

function renderStudentResults(studentId) {
    const grades = getGrades().filter(g => g.studentId === studentId && g.status === 'approved');
    const container = document.getElementById('resultsTableContainer');
    if (grades.length === 0) {
        container.innerHTML = '<p class="text-muted">No approved results yet. Please contact your lecturer.</p>';
        document.getElementById('cgpaDisplay').textContent = '0.00';
        return false;
    }
    let html = `<div class="table-responsive"><table class="table table-sm table-bordered"><thead><tr><th>Course Code</th><th>Title</th><th>Credit</th><th>Grade</th><th>GP</th></tr></thead><tbody>`;
    let totalPoints = 0, totalCredits = 0;
    grades.forEach(g => {
        totalPoints += g.gp * g.credit;
        totalCredits += g.credit;
        html += `<tr><td>${g.courseCode}</td><td>${g.courseTitle}</td><td>${g.credit}</td><td>${g.grade}</td><td>${g.gp.toFixed(1)}</td></tr>`;
    });
    html += `</tbody></table></div>`;
    container.innerHTML = html;
    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    document.getElementById('cgpaDisplay').textContent = cgpa.toFixed(2);
    return true;
}

function updateInfoCard(studentId, hasResults) {
    const card = document.getElementById('infoCard');
    if (!card) return;
    if (hasResults) {
        card.innerHTML = `
            <p class="mb-0 text-success">
                <i class="fas fa-check-circle me-1"></i> <strong>Your results are available!</strong><br>
                <small class="text-muted">Results uploaded.</small>
            </p>
        `;
    } else {
        card.innerHTML = `
            <p class="mb-0 text-muted">
                <i class="fas fa-clock me-1"></i> <strong>No results yet.</strong><br>
                <small>Results are not uploaded yet.</small>
            </p>
        `;
    }
}

// ---- TRANSCRIPT FUNCTION WITH FALLBACK ----
function generateTranscript(studentId) {
    const students = getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) {
        showErrorModal('Error', 'Student not found.');
        return;
    }
    const grades = getGrades().filter(g => g.studentId === studentId && g.status === 'approved');
    if (grades.length === 0) {
        showErrorModal('No Results', 'No approved results to generate transcript.');
        return;
    }
    let totalPoints = 0, totalCredits = 0, rows = '';
    grades.forEach(g => {
        totalPoints += g.gp * g.credit;
        totalCredits += g.credit;
        rows += `<tr><td>${g.courseCode}</td><td>${g.courseTitle}</td><td>${g.credit}</td><td>${g.grade}</td><td>${g.gp.toFixed(1)}</td></tr>`;
    });
    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;

    const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Transcript - ${student.name}</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
            <style>
                body { padding: 30px; }
                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
                .cgpa { font-size: 1.2rem; font-weight: bold; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>OFFICIAL TRANSCRIPT</h2>
                <p><strong>${student.name}</strong> (${student.program}) - ${student.level}</p>
                <p>Student ID: ${student.id}</p>
            </div>
            <table class="table table-bordered">
                <thead><tr><th>Course</th><th>Title</th><th>Credit</th><th>Grade</th><th>GP</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
            <p class="cgpa">CGPA: ${cgpa.toFixed(2)}</p>
            <button class="btn btn-primary no-print" onclick="window.print()">Print Transcript</button>
            <br><br>
            <button class="btn btn-secondary no-print" onclick="window.close()">Close</button>
        </body>
        </html>
    `;

    const win = window.open('', '_blank');
    if (!win) {
        // Fallback: download HTML file
        showErrorModal('Pop-up Blocked', 'Your transcript will download as an HTML file.');
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Transcript_${student.name.replace(/\s/g, '_')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
    }

    win.document.write(content);
    win.document.close();
    win.focus();
}

// ---- LECTURER ----
function renderLecturerView(user) {
    const lecturerId = user.lecturerId;
    if (!lecturerId) {
        document.getElementById('lecturerCoursesList').innerHTML = '<p class="text-danger">No lecturer profile found.</p>';
        document.getElementById('gradeEntryArea').innerHTML = '<p class="text-muted">Select a course from the left.</p>';
        return;
    }
    const courses = getCourses().filter(c => c.lecturerId === lecturerId);
    const container = document.getElementById('lecturerCoursesList');
    if (courses.length === 0) {
        container.innerHTML = `<div class="alert alert-warning">No courses assigned. Contact admin.</div>`;
        document.getElementById('gradeEntryArea').innerHTML = '<p class="text-muted">Select a course from the left.</p>';
        return;
    }
    let html = '<div class="list-group">';
    courses.forEach(c => {
        const enrollCount = getEnrollments().filter(e => e.courseId === c.id).length;
        html += `<a href="#" class="list-group-item list-group-item-action" data-course-id="${c.id}">
            <div class="d-flex justify-content-between align-items-center">
                <div><strong>${c.code}</strong> - ${c.title}<br><small class="text-muted">${c.credit} CU</small></div>
                <span class="badge bg-primary rounded-pill">${enrollCount} students</span>
            </div>
        </a>`;
    });
    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const courseId = parseInt(this.dataset.courseId);
            loadGradeEntry(courseId);
        });
    });

    if (courses.length > 0) loadGradeEntry(courses[0].id);
}

function loadGradeEntry(courseId) {
    const area = document.getElementById('gradeEntryArea');
    const course = getCourses().find(c => c.id === courseId);
    if (!course) return;
    const enrollments = getEnrollments().filter(e => e.courseId === courseId);
    const students = getStudents();
    const grades = getGrades();
    if (enrollments.length === 0) {
        area.innerHTML = `<div class="alert alert-warning">No students enrolled in ${course.code}.</div>`;
        return;
    }
    let html = `<h5>${course.code} - ${course.title}</h5>
        <form id="gradeEntryForm">
        <div class="table-responsive">
        <table class="table table-sm table-bordered">
            <thead><tr><th>Student</th><th>Test (max 20)</th><th>Exam (max 80)</th><th>Total</th><th>Grade</th><th>Status</th></tr></thead>
            <tbody>`;
    enrollments.forEach(enrol => {
        const student = students.find(s => s.id === enrol.studentId);
        const grade = grades.find(g => g.studentId === enrol.studentId && g.courseId === courseId);
        const test = grade ? grade.test : '';
        const exam = grade ? grade.exam : '';
        const total = grade ? grade.total : '';
        const letter = grade ? grade.grade : '';
        const status = grade ? grade.status : 'Not entered';
        html += `<tr>
            <td>${student ? student.name : 'Unknown'}</td>
            <td><input type="number" class="form-control form-control-sm test-input" data-student="${enrol.studentId}" value="${test}" min="0" max="20"></td>
            <td><input type="number" class="form-control form-control-sm exam-input" data-student="${enrol.studentId}" value="${exam}" min="0" max="80"></td>
            <td class="total-display" data-student="${enrol.studentId}">${total}</td>
            <td class="grade-display" data-student="${enrol.studentId}">${letter}</td>
            <td>${status}</td>
        </tr>`;
    });
    html += `</tbody></table>
        </div>
        <div class="d-flex flex-wrap gap-2 mt-3">
            <button type="button" class="btn btn-success btn-sm" id="submitGradesBtn"><i class="fas fa-paper-plane"></i> Submit for Approval</button>
            <button type="button" class="btn btn-secondary btn-sm" id="saveDraftBtn"><i class="fas fa-save"></i> Save Draft</button>
            <button type="button" class="btn btn-outline-danger btn-sm" id="resetGradesBtn"><i class="fas fa-undo"></i> Reset</button>
        </div>
        </form>`;
    area.innerHTML = html;

    area.querySelectorAll('.test-input, .exam-input').forEach(inp => {
        inp.addEventListener('input', function() {
            const studentId = parseInt(this.dataset.student);
            const test = parseFloat(document.querySelector(`.test-input[data-student="${studentId}"]`).value) || 0;
            const exam = parseFloat(document.querySelector(`.exam-input[data-student="${studentId}"]`).value) || 0;
            const total = test + exam;
            const grade = getLetterGrade(total);
            document.querySelector(`.total-display[data-student="${studentId}"]`).textContent = total;
            document.querySelector(`.grade-display[data-student="${studentId}"]`).textContent = grade;
        });
    });

    document.getElementById('saveDraftBtn').addEventListener('click', function() {
        saveGradesFromForm(courseId, 'draft');
        showSuccessModal('Draft Saved', 'Grades have been saved as draft.');
        loadGradeEntry(courseId);
    });
    document.getElementById('submitGradesBtn').addEventListener('click', function() {
        saveGradesFromForm(courseId, 'submitted');
        showSuccessModal('Submitted', 'Grades have been submitted for approval.');
        loadGradeEntry(courseId);
    });
    document.getElementById('resetGradesBtn').addEventListener('click', function() {
        showConfirmModal('Reset Grades', 'Are you sure you want to reset all grades for this course?', function() {
            const grades = getGrades();
            const toRemove = grades.filter(g => g.courseId === courseId);
            toRemove.forEach(g => {
                const index = grades.indexOf(g);
                if (index > -1) grades.splice(index, 1);
            });
            saveGrades(grades);
            loadGradeEntry(courseId);
            showSuccessModal('Reset Complete', 'All grades for this course have been reset.');
        });
    });
}

// ============================================================
// saveGradesFromForm
// ============================================================
function saveGradesFromForm(courseId, status) {
    const rows = document.querySelectorAll('#gradeEntryForm tbody tr');
    const grades = getGrades();
    const course = getCourses().find(c => c.id === courseId);
    if (!course) {
        console.warn('Course not found for ID:', courseId);
        return;
    }

    rows.forEach(row => {
        const studentId = parseInt(row.querySelector('.test-input').dataset.student);
        const test = parseFloat(row.querySelector('.test-input').value) || 0;
        const exam = parseFloat(row.querySelector('.exam-input').value) || 0;
        const total = test + exam;
        const grade = getLetterGrade(total);
        const gp = getGradePoint(grade);

        let existing = grades.find(g => g.studentId === studentId && g.courseId === courseId);
        if (existing) {
            existing.test = test;
            existing.exam = exam;
            existing.total = total;
            existing.grade = grade;
            existing.gp = gp;
            existing.status = status;
            existing.courseCode = course.code;
            existing.courseTitle = course.title;
            existing.credit = course.credit;
        } else {
            grades.push({
                id: generateId(grades),
                studentId,
                courseId,
                courseCode: course.code,
                courseTitle: course.title,
                credit: course.credit,
                test,
                exam,
                total,
                grade,
                gp,
                status
            });
        }
    });
    saveGrades(grades);
}

// ============================================================
// ADMIN VIEW
// ============================================================
function renderAdminView() {
    renderAdminStudents();
    renderAdminLecturers();
    renderAdminCourses();
    renderAdminEnrollments();
    renderAdminApprovals();
    renderGradeChart();
    // No need to attach listeners – buttons use onclick
}

// ---- ADMIN: STUDENTS ----
function renderAdminStudents() {
    const students = getStudents();
    let html = '';
    if (students.length === 0) {
        html += `<tr><td colspan="6" class="text-muted">No students registered yet.</td></tr>`;
    } else {
        students.forEach(s => {
            html += `<tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.program}</td>
                <td>${s.level}</td>
                <td>
                    <button class="btn btn-sm btn-danger delete-student" data-id="${s.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
        });
    }
    document.getElementById('adminStudentsList').innerHTML = html;

    document.querySelectorAll('.delete-student').forEach(btn => {
        btn.addEventListener('click', function() {
            const studentId = parseInt(this.dataset.id);
            const students = getStudents();
            const student = students.find(s => s.id === studentId);
            if (student) {
                showConfirmModal('Delete Student', 
                    `Are you sure you want to delete student "${student.name}"?\n\nThis will also remove all their enrollments and grades.`, 
                    function() {
                        deleteStudent(studentId);
                    }
                );
            }
        });
    });
}

// ---- ADMIN: LECTURERS ----
function renderAdminLecturers() {
    const lecturers = getLecturers();
    let html = '';
    if (lecturers.length === 0) {
        html += `<tr><td colspan="5" class="text-muted">No lecturers added yet.</td></tr>`;
    } else {
        lecturers.forEach(l => {
            html += `<tr>
                <td>${l.id}</td>
                <td>${l.name}</td>
                <td>${l.email}</td>
                <td>${l.department}</td>
                <td>
                    <button class="btn btn-sm btn-danger delete-lecturer" data-id="${l.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
        });
    }
    document.getElementById('adminLecturersList').innerHTML = html;

    document.querySelectorAll('.delete-lecturer').forEach(btn => {
        btn.addEventListener('click', function() {
            const lecturerId = parseInt(this.dataset.id);
            const lecturers = getLecturers();
            const lecturer = lecturers.find(l => l.id === lecturerId);
            if (lecturer) {
                showConfirmModal('Delete Lecturer', 
                    `Are you sure you want to delete lecturer "${lecturer.name}"?\n\nThis will unassign their courses.`, 
                    function() {
                        deleteLecturer(lecturerId);
                    }
                );
            }
        });
    });
}

// ---- DELETE STUDENT ----
function deleteStudent(studentId) {
    let students = getStudents();
    students = students.filter(s => s.id !== studentId);
    saveStudents(students);

    let users = getUsers();
    users = users.filter(u => u.studentId !== studentId);
    saveUsers(users);

    let enrollments = getEnrollments();
    enrollments = enrollments.filter(e => e.studentId !== studentId);
    saveEnrollments(enrollments);

    let grades = getGrades();
    grades = grades.filter(g => g.studentId !== studentId);
    saveGrades(grades);

    renderAdminStudents();
    renderAdminEnrollments();
    renderAdminApprovals();
    renderGradeChart();

    showSuccessModal('Student Deleted', 'The student and all their data have been removed.');
}

// ---- DELETE LECTURER ----
function deleteLecturer(lecturerId) {
    const courses = getCourses();
    const hasCourses = courses.some(c => c.lecturerId === lecturerId);
    
    if (hasCourses) {
        courses.forEach(c => {
            if (c.lecturerId === lecturerId) {
                c.lecturerId = null;
            }
        });
        saveCourses(courses);
    }

    let lecturers = getLecturers();
    lecturers = lecturers.filter(l => l.id !== lecturerId);
    saveLecturers(lecturers);

    let users = getUsers();
    users = users.filter(u => u.lecturerId !== lecturerId);
    saveUsers(users);

    renderAdminLecturers();
    renderAdminCourses();

    const message = hasCourses ? 
        'The lecturer has been removed and their courses have been unassigned.' : 
        'The lecturer has been removed.';

    showSuccessModal('Lecturer Deleted', message);
}

// ---- ADMIN: COURSES ----
function renderAdminCourses() {
    const courses = getCourses();
    const lecturers = getLecturers();
    let html = '';
    if (courses.length === 0) {
        html += `<tr><td colspan="5" class="text-muted">No courses added yet.</td></tr>`;
    } else {
        courses.forEach(c => {
            const lec = lecturers.find(l => l.id === c.lecturerId);
            html += `<tr>
                <td>${c.code}</td>
                <td>${c.title}</td>
                <td>${c.credit}</td>
                <td>${lec ? lec.name : '⚠️ Unassigned'}</td>
                <td>
                    <button class="btn btn-sm btn-danger delete-course" data-id="${c.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
        });
    }
    document.getElementById('adminCoursesList').innerHTML = html;

    document.querySelectorAll('.delete-course').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            showConfirmModal('Delete Course', 'Are you sure you want to delete this course? All related grades and enrollments will be removed.', function() {
                let courses = getCourses();
                courses = courses.filter(c => c.id !== id);
                saveCourses(courses);
                let enrollments = getEnrollments();
                enrollments = enrollments.filter(e => e.courseId !== id);
                saveEnrollments(enrollments);
                let grades = getGrades();
                grades = grades.filter(g => g.courseId !== id);
                saveGrades(grades);
                renderAdminCourses();
                renderAdminEnrollments();
                renderAdminApprovals();
                renderGradeChart();
                showSuccessModal('Course Deleted', 'The course and its data have been removed.');
            });
        });
    });
}

// ---- ADMIN: ENROLLMENTS ----
function renderAdminEnrollments() {
    const enrollments = getEnrollments();
    const students = getStudents();
    const courses = getCourses();
    let html = '';
    if (enrollments.length === 0) {
        html += `<tr><td colspan="5" class="text-muted">No enrollments yet.</td></tr>`;
    } else {
        enrollments.forEach(e => {
            const student = students.find(s => s.id === e.studentId);
            const course = courses.find(c => c.id === e.courseId);
            html += `<tr>
                <td>${student ? student.name : 'Unknown'}</td>
                <td>${course ? course.code : 'Unknown'}</td>
                <td>${e.session}</td>
                <td>${e.semester}</td>
                <td>
                    <button class="btn btn-sm btn-danger delete-enrollment" data-id="${e.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
        });
    }
    document.getElementById('adminEnrollmentsList').innerHTML = html;

    document.querySelectorAll('.delete-enrollment').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            showConfirmModal('Remove Enrollment', 'Are you sure you want to remove this enrollment?', function() {
                let enrollments = getEnrollments();
                enrollments = enrollments.filter(e => e.id !== id);
                saveEnrollments(enrollments);
                renderAdminEnrollments();
                showSuccessModal('Enrollment Removed', 'The enrollment has been removed.');
            });
        });
    });
}

// ---- ADMIN: APPROVALS ----
function renderAdminApprovals() {
    const grades = getGrades().filter(g => g.status === 'submitted');
    const students = getStudents();
    const courses = getCourses();
    let html = '';
    if (grades.length === 0) {
        html += `<tr><td colspan="7" class="text-muted text-center">✅ No pending approvals.</td></tr>`;
    } else {
        grades.forEach(g => {
            const student = students.find(s => s.id === g.studentId);
            const course = courses.find(c => c.id === g.courseId);
            html += `<tr>
                <td>${student ? student.name : 'Unknown'}</td>
                <td>${course ? course.code : 'Unknown'}</td>
                <td>${g.test}</td>
                <td>${g.exam}</td>
                <td><strong>${g.total}</strong></td>
                <td>${g.grade}</td>
                <td>
                    <button class="btn btn-sm btn-success approve-grade" data-student="${g.studentId}" data-course="${g.courseId}">Approve</button>
                    <button class="btn btn-sm btn-danger reject-grade" data-student="${g.studentId}" data-course="${g.courseId}">Reject</button>
                </td>
            </tr>`;
        });
    }
    document.getElementById('adminApprovalsList').innerHTML = html;

    document.querySelectorAll('.approve-grade').forEach(btn => {
        btn.addEventListener('click', function() {
            const studentId = parseInt(this.dataset.student);
            const courseId = parseInt(this.dataset.course);
            const grades = getGrades();
            const grade = grades.find(g => g.studentId === studentId && g.courseId === courseId);
            if (grade) {
                grade.status = 'approved';
                saveGrades(grades);
                renderAdminApprovals();
                renderGradeChart();
                showSuccessModal('Grade Approved', 'The grade has been approved.');
            }
        });
    });
    document.querySelectorAll('.reject-grade').forEach(btn => {
        btn.addEventListener('click', function() {
            const studentId = parseInt(this.dataset.student);
            const courseId = parseInt(this.dataset.course);
            const grades = getGrades();
            const grade = grades.find(g => g.studentId === studentId && g.courseId === courseId);
            if (grade) {
                grade.status = 'draft';
                saveGrades(grades);
                renderAdminApprovals();
                showSuccessModal('Grade Rejected', 'The grade has been rejected and returned to draft.');
            }
        });
    });
}

// ---- GRADE CHART ----
let gradeChartInstance = null;
function renderGradeChart() {
    const grades = getGrades().filter(g => g.status === 'approved');
    const counts = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
    grades.forEach(g => {
        if (counts.hasOwnProperty(g.grade)) counts[g.grade]++;
    });
    const ctx = document.getElementById('gradeChart').getContext('2d');
    if (gradeChartInstance) gradeChartInstance.destroy();
    gradeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['A', 'B', 'C', 'D', 'F'],
            datasets: [{
                label: 'Students',
                data: [counts.A, counts.B, counts.C, counts.D, counts.F],
                backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#fd7e14', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Grade Distribution (Approved Results)' }
            }
        }
    });
}

// ============================================================
// ADMIN SETTINGS FUNCTIONS
// ============================================================

function loadAdminSettings() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser.role === 'admin') {
        const users = getUsers();
        const user = users.find(u => u.id === currentUser.id);
        if (user) {
            document.getElementById('currentEmail').value = user.email;
            document.getElementById('newEmail').value = user.email;
        }
    }
}

function saveSettings() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        showErrorModal('Access Denied', 'You are not authorized.');
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.id === currentUser.id);
    if (!user) {
        showErrorModal('Error', 'User not found.');
        return;
    }

    const newEmail = document.getElementById('newEmail').value.trim();
    const currentPass = document.getElementById('currentPassword').value.trim();
    const newPass = document.getElementById('newPassword').value.trim();
    const confirmPass = document.getElementById('confirmNewPassword').value.trim();

    if (user.password !== currentPass) {
        showErrorModal('Incorrect Password', 'Current password is incorrect.');
        return;
    }

    if (!newEmail || !document.getElementById('newEmail').checkValidity()) {
        showErrorModal('Invalid Email', 'Please enter a valid email.');
        return;
    }

    if (newEmail !== user.email && users.find(u => u.email === newEmail && u.id !== user.id)) {
        showErrorModal('Email Taken', 'This email is already in use by another account.');
        return;
    }

    user.email = newEmail;

    if (newPass.length > 0) {
        if (newPass.length < 6) {
            showErrorModal('Weak Password', 'New password must be at least 6 characters.');
            return;
        }
        if (newPass !== confirmPass) {
            showErrorModal('Password Mismatch', 'New passwords do not match.');
            return;
        }
        user.password = newPass;
    }

    saveUsers(users);

    currentUser.email = newEmail;
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
    document.getElementById('newEmail').value = newEmail;
    document.getElementById('currentEmail').value = newEmail;

    const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
    if (modal) modal.hide();

    document.getElementById('userName').textContent = 'Admin';

    showSuccessModal('Settings Updated', 'Your admin credentials have been updated. Please use the new email/password for future logins.');
}

// ============================================================
// MODAL SUBMIT FUNCTIONS (called by onclick)
// ============================================================

function saveStudent() {
    const name = document.getElementById('studentName').value.trim();
    const email = document.getElementById('studentEmail').value.trim();
    const program = document.getElementById('studentProgram').value.trim();
    const level = document.getElementById('studentLevel').value.trim();

    if (!name || !email || !program || !level) {
        showErrorModal('Missing Fields', 'Please fill all fields.');
        return;
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
        showErrorModal('Duplicate Email', 'This email is already registered.');
        return;
    }

    const students = getStudents();
    const newId = generateId(students);
    students.push({ id: newId, name, email, program, level });
    saveStudents(students);

    users.push({
        id: generateId(users),
        email,
        password: 'student123',
        role: 'student',
        studentId: newId,
        lecturerId: null
    });
    saveUsers(users);

    // Clear form
    document.getElementById('studentName').value = '';
    document.getElementById('studentEmail').value = '';
    document.getElementById('studentProgram').value = '';
    document.getElementById('studentLevel').value = '';

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
    if (modal) modal.hide();

    renderAdminStudents();
    showSuccessModal('Student Added', `Student "${name}" created successfully!\nPassword: student123`);
}

function saveCourse() {
    const code = document.getElementById('courseCodeInput').value.trim();
    const title = document.getElementById('courseTitleInput').value.trim();
    const credit = parseInt(document.getElementById('courseCreditInput').value);
    const lecturerId = parseInt(document.getElementById('courseLecturerSelect').value);

    if (!code || !title || isNaN(credit) || !lecturerId) {
        showErrorModal('Missing Fields', 'Please fill all fields and select a lecturer.');
        return;
    }

    const courses = getCourses();
    if (courses.find(c => c.code === code)) {
        showErrorModal('Duplicate Code', 'A course with this code already exists.');
        return;
    }

    courses.push({
        id: generateId(courses),
        code,
        title,
        credit,
        lecturerId
    });
    saveCourses(courses);

    // Clear form
    document.getElementById('courseCodeInput').value = '';
    document.getElementById('courseTitleInput').value = '';
    document.getElementById('courseCreditInput').value = '';
    document.getElementById('courseLecturerSelect').value = '';

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addCourseModal'));
    if (modal) modal.hide();

    renderAdminCourses();
    showSuccessModal('Course Added', `Course "${code}" created successfully.`);
}

function saveLecturer() {
    const name = document.getElementById('lecName').value.trim();
    const email = document.getElementById('lecEmail').value.trim();
    const password = document.getElementById('lecPassword').value;
    const department = document.getElementById('lecDepartment').value.trim();

    if (!name || !email || !password || !department) {
        showErrorModal('Missing Fields', 'Please fill all fields.');
        return;
    }
    if (password.length < 6) {
        showErrorModal('Invalid Password', 'Password must be at least 6 characters.');
        return;
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
        showErrorModal('Duplicate Email', 'This email is already registered. Please use a different email.');
        return;
    }

    const lecturers = getLecturers();
    const newLid = generateId(lecturers);
    lecturers.push({
        id: newLid,
        name,
        email,
        department
    });
    saveLecturers(lecturers);

    users.push({
        id: generateId(users),
        email,
        password,
        role: 'lecturer',
        studentId: null,
        lecturerId: newLid
    });
    saveUsers(users);

    // Clear form
    document.getElementById('lecName').value = '';
    document.getElementById('lecEmail').value = '';
    document.getElementById('lecPassword').value = '';
    document.getElementById('lecDepartment').value = '';

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('createLecturerModal'));
    if (modal) modal.hide();

    renderAdminLecturers();
    renderAdminCourses();
    showSuccessModal('Lecturer Created', `Lecturer "${name}" created successfully!\nEmail: ${email}\nPassword: ${password}`);
}

function saveEnrollment() {
    const studentId = parseInt(document.getElementById('enrollStudentSelect').value);
    const courseId = parseInt(document.getElementById('enrollCourseSelect').value);
    const session = document.getElementById('enrollSession').value.trim();
    const semester = parseInt(document.getElementById('enrollSemester').value);

    if (!studentId || !courseId || !session) {
        showErrorModal('Missing Fields', 'Please select all fields.');
        return;
    }

    const enrollments = getEnrollments();
    if (enrollments.find(e => e.studentId === studentId && e.courseId === courseId)) {
        showErrorModal('Duplicate Enrollment', 'This student is already enrolled in this course.');
        return;
    }

    enrollments.push({
        id: generateId(enrollments),
        studentId,
        courseId,
        session,
        semester
    });
    saveEnrollments(enrollments);

    // Clear form
    document.getElementById('enrollStudentSelect').value = '';
    document.getElementById('enrollCourseSelect').value = '';
    document.getElementById('enrollSession').value = '2024/2025';
    document.getElementById('enrollSemester').value = '1';

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('enrollStudentModal'));
    if (modal) modal.hide();

    renderAdminEnrollments();
    showSuccessModal('Enrollment Added', 'Student enrolled successfully.');
}