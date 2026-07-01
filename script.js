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
    return arr.length ? Math.max(...arr.map(function(x) { return x.id; })) + 1 : 1;
}

function getGradePoint(grade) {
    var map = { 'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'F': 0.0 };
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
// INITIALISE MOCK DATA – YOUR CUSTOM DATA
// ============================================================
function initData() {
    console.log('Initializing data...');

    // --- USERS ---
    if (!localStorage.getItem('users')) {
        var users = [
            // ADMIN
            { id: 1, email: 'shaibuasmau@gmail.com', password: 'ADMIN', role: 'admin', studentId: null, lecturerId: null },
            // LECTURERS
            { id: 2, email: 'awal@gmail.com', password: '101010', role: 'lecturer', studentId: null, lecturerId: 1 },
            { id: 3, email: 'sediq@gmail.com', password: '101010', role: 'lecturer', studentId: null, lecturerId: 2 },
            // STUDENTS
            { id: 4, email: 'shaibumariam@gmail.com', password: '101010', role: 'student', studentId: 1, lecturerId: null },
            { id: 5, email: 'shaibuaishat@gmail.com', password: '101010', role: 'student', studentId: 2, lecturerId: null }
        ];
        saveUsers(users);
        console.log('Users created:', users);
    }

    // --- STUDENTS ---
    if (!localStorage.getItem('students')) {
        var students = [
            { id: 1, name: 'Shaibu Mariam', email: 'shaibumariam@gmail.com', program: 'Computer Science', level: 'ND1' },
            { id: 2, name: 'Shaibu Aishat', email: 'shaibuaishat@gmail.com', program: 'Computer Science', level: 'ND1' }
        ];
        saveStudents(students);
        console.log('Students created:', students);
    }

    // --- LECTURERS ---
    if (!localStorage.getItem('lecturers')) {
        var lecturers = [
            { id: 1, name: 'Muhammed Awal', email: 'awal@gmail.com', department: 'Computer Science' },
            { id: 2, name: 'Shaibu Sediq', email: 'sediq@gmail.com', department: 'Computer Science' }
        ];
        saveLecturers(lecturers);
        console.log('Lecturers created:', lecturers);
    }

    // --- COURSES ---
    if (!localStorage.getItem('courses')) {
        var courses = [
            { id: 1, code: 'CSC101', title: 'Introduction to Programming', credit: 3, lecturerId: 1 },
            { id: 2, code: 'CSS102', title: 'Computer Systems & Architecture', credit: 3, lecturerId: 1 },
            { id: 3, code: 'CSC104', title: 'Data Structures & Algorithms', credit: 3, lecturerId: 2 },
            { id: 4, code: 'CSC108', title: 'Object-Oriented Programming', credit: 3, lecturerId: 2 }
        ];
        saveCourses(courses);
        console.log('Courses created:', courses);
    }

    // --- ENROLLMENTS ---
    if (!localStorage.getItem('enrollments')) {
        var enrollments = [
            { id: 1, studentId: 1, courseId: 1, session: '2024/2025', semester: 1 },
            { id: 2, studentId: 1, courseId: 2, session: '2024/2025', semester: 1 },
            { id: 3, studentId: 2, courseId: 1, session: '2024/2025', semester: 1 },
            { id: 4, studentId: 2, courseId: 3, session: '2024/2025', semester: 1 }
        ];
        saveEnrollments(enrollments);
        console.log('Enrollments created:', enrollments);
    }

    // --- GRADES ---
    if (!localStorage.getItem('grades')) {
        var grades = [
            { id: 1, studentId: 1, courseId: 1, test: 18, exam: 60, total: 78, grade: 'A', gp: 5.0, status: 'approved', courseCode: 'CSC101', courseTitle: 'Introduction to Programming', credit: 3 },
            { id: 2, studentId: 1, courseId: 2, test: 12, exam: 40, total: 52, grade: 'C', gp: 3.0, status: 'approved', courseCode: 'CSS102', courseTitle: 'Computer Systems & Architecture', credit: 3 },
            { id: 3, studentId: 2, courseId: 1, test: 10, exam: 45, total: 55, grade: 'C', gp: 3.0, status: 'submitted', courseCode: 'CSC101', courseTitle: 'Introduction to Programming', credit: 3 }
        ];
        saveGrades(grades);
        console.log('Grades created:', grades);
    }

    console.log('Data initialization complete!');
}

// CALL initData() IMMEDIATELY
initData();

// ============================================================
// GLOBAL MODAL HELPERS
// ============================================================
function showSuccessModal(title, message) {
    document.getElementById('successModalTitle').textContent = title || 'Success';
    document.getElementById('successModalMessage').textContent = message || 'Operation completed successfully.';
    var modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

function showErrorModal(title, message) {
    document.getElementById('errorModalTitle').textContent = title || 'Error';
    document.getElementById('errorModalMessage').textContent = message || 'An error occurred.';
    var modal = new bootstrap.Modal(document.getElementById('errorModal'));
    modal.show();
}

function showConfirmModal(title, message, onConfirm) {
    document.getElementById('confirmModalTitle').textContent = title || 'Confirm';
    document.getElementById('confirmModalMessage').textContent = message || 'Are you sure?';
    var modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    var yesBtn = document.getElementById('confirmModalYesBtn');
    var newYesBtn = yesBtn.cloneNode(true);
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
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found');
        var emailInput = document.getElementById('email');
        var passwordInput = document.getElementById('password');
        
        emailInput.addEventListener('input', function() {
            var valid = this.value.trim() !== '' && this.checkValidity();
            this.classList.toggle('is-invalid', !valid);
        });
        passwordInput.addEventListener('input', function() {
            this.classList.toggle('is-invalid', this.value.trim() === '');
        });
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted');
            var email = emailInput.value.trim();
            var password = passwordInput.value.trim();
            var role = document.getElementById('role').value;
            
            if (!email || !password) {
                showLoginError('Please fill in both email and password.');
                return;
            }
            if (!emailInput.checkValidity()) {
                showLoginError('Please enter a valid email address.');
                return;
            }
            
            var users = getUsers();
            console.log('Users in system:', users);
            
            var user = users.find(function(u) {
                return u.email === email && u.password === password && u.role === role;
            });
            
            if (!user) {
                showLoginError('Invalid email, password, or role. Please try again.');
                return;
            }
            
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        });
    }

    // --- REGISTRATION PAGE ---
    var regForm = document.getElementById('registerForm');
    if (regForm) {
        console.log('Registration form found');
        var regName = document.getElementById('regName');
        var regEmail = document.getElementById('regEmail');
        var regPassword = document.getElementById('regPassword');
        var regConfirm = document.getElementById('regConfirmPassword');
        var regProgram = document.getElementById('regProgram');
        var regLevel = document.getElementById('regLevel');
        var courseArea = document.getElementById('courseSelectionArea');
        
        // --- LOAD COURSES ---
        function loadCoursesForRegistration() {
            console.log('Loading courses...');
            var courses = getCourses();
            console.log('Courses found:', courses);
            if (!courseArea) {
                console.warn('courseSelectionArea not found!');
                return;
            }
            if (courses.length === 0) {
                courseArea.innerHTML = '<p class="text-muted small text-center my-2">No courses available. Please contact admin.</p>';
                return;
            }
            var html = '';
            courses.forEach(function(c) {
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
        
        loadCoursesForRegistration();
        
        // ---- Live validation ----
        regName.addEventListener('input', function() {
            this.classList.toggle('is-invalid', this.value.trim() === '');
        });
        regEmail.addEventListener('input', function() {
            var valid = this.value.trim() !== '' && this.checkValidity();
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
            var name = regName.value.trim();
            var email = regEmail.value.trim();
            var password = regPassword.value;
            var confirm = regConfirm.value;
            var program = regProgram.value.trim();
            var level = regLevel.value;
            
            var selectedCourses = [];
            document.querySelectorAll('.course-checkbox:checked').forEach(function(cb) {
                selectedCourses.push(parseInt(cb.value));
            });
            
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
            
            var users = getUsers();
            if (users.find(function(u) { return u.email === email; })) {
                showRegisterError('This email is already registered. Please login.');
                return;
            }
            
            var students = getStudents();
            var newSid = generateId(students);
            students.push({ id: newSid, name: name, email: email, program: program, level: level });
            saveStudents(students);
            
            users.push({
                id: generateId(users),
                email: email,
                password: password,
                role: 'student',
                studentId: newSid,
                lecturerId: null
            });
            saveUsers(users);
            
            var enrollments = getEnrollments();
            selectedCourses.forEach(function(courseId) {
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
            
            var successModal = new bootstrap.Modal(document.getElementById('registerSuccessModal'));
            successModal.show();
            
            document.getElementById('regSuccessRedirectBtn').addEventListener('click', function() {
                sessionStorage.setItem('currentUser', JSON.stringify({ 
                    email: email, 
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
        var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
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
    }
});

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function showLoginError(msg) {
    document.getElementById('loginErrorMessage').textContent = msg;
    var modal = new bootstrap.Modal(document.getElementById('loginErrorModal'));
    modal.show();
}

function showRegisterError(msg) {
    document.getElementById('registerErrorMessage').textContent = msg;
    var modal = new bootstrap.Modal(document.getElementById('registerErrorModal'));
    modal.show();
}

// ============================================================
// DASHBOARD RENDER FUNCTIONS (SIMPLIFIED)
// ============================================================

function renderDashboard(user) {
    console.log('Rendering dashboard for:', user);
    if (!user) return;

    var displayName = user.email;
    if (user.role === 'student') {
        var students = getStudents();
        var s = students.find(function(st) { return st.id === user.studentId; });
        if (s) displayName = s.name;
    } else if (user.role === 'lecturer') {
        var lecturers = getLecturers();
        var l = lecturers.find(function(lec) { return lec.id === user.lecturerId; });
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
    }
}

// ---- STUDENT ----
function renderStudentView(user) {
    var students = getStudents();
    var student = students.find(function(s) { return s.id === user.studentId; });
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

    renderStudentResults(student.id);
    updateInfoCard(student.id);
}

function renderStudentResults(studentId) {
    var grades = getGrades().filter(function(g) { return g.studentId === studentId && g.status === 'approved'; });
    var container = document.getElementById('resultsTableContainer');
    if (grades.length === 0) {
        container.innerHTML = '<p class="text-muted">No approved results yet. Please contact your lecturer.</p>';
        document.getElementById('cgpaDisplay').textContent = '0.00';
        return false;
    }
    var html = '<div class="table-responsive"><table class="table table-sm table-bordered"><thead><tr><th>Course Code</th><th>Title</th><th>Credit</th><th>Grade</th><th>GP</th></tr></thead><tbody>';
    var totalPoints = 0, totalCredits = 0;
    grades.forEach(function(g) {
        totalPoints += g.gp * g.credit;
        totalCredits += g.credit;
        html += '<tr><td>' + g.courseCode + '</td><td>' + g.courseTitle + '</td><td>' + g.credit + '</td><td>' + g.grade + '</td><td>' + g.gp.toFixed(1) + '</td></tr>';
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
    var cgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    document.getElementById('cgpaDisplay').textContent = cgpa.toFixed(2);
    return true;
}

function updateInfoCard(studentId) {
    var card = document.getElementById('infoCard');
    if (!card) return;
    var grades = getGrades().filter(function(g) { return g.studentId === studentId && g.status === 'approved'; });
    if (grades.length > 0) {
        card.innerHTML = `
            <p class="mb-0 text-success">
                <i class="fas fa-check-circle me-1"></i> <strong>Your results are available!</strong><br>
                <small class="text-muted">Results uploaded</small>
            </p>
        `;
    } else {
        card.innerHTML = `
            <p class="mb-0 text-muted">
                <i class="fas fa-clock me-1"></i> <strong>No results yet.</strong><br>
                <small> No result uploaded</small>
            </p>
        `;
    }
}

// ---- LECTURER (Simplified) ----
function renderLecturerView(user) {
    var lecturerId = user.lecturerId;
    if (!lecturerId) {
        document.getElementById('lecturerCoursesList').innerHTML = '<p class="text-danger">No lecturer profile found.</p>';
        return;
    }
    var courses = getCourses().filter(function(c) { return c.lecturerId === lecturerId; });
    var container = document.getElementById('lecturerCoursesList');
    if (courses.length === 0) {
        container.innerHTML = '<div class="alert alert-warning">No courses assigned. Contact admin.</div>';
        document.getElementById('gradeEntryArea').innerHTML = '<p class="text-muted">Select a course from the left.</p>';
        return;
    }
    var html = '<div class="list-group">';
    courses.forEach(function(c) {
        var enrollCount = getEnrollments().filter(function(e) { return e.courseId === c.id; }).length;
        html += '<a href="#" class="list-group-item list-group-item-action" data-course-id="' + c.id + '">';
        html += '<div class="d-flex justify-content-between align-items-center">';
        html += '<div><strong>' + c.code + '</strong> - ' + c.title + '<br><small class="text-muted">' + c.credit + ' CU</small></div>';
        html += '<span class="badge bg-primary rounded-pill">' + enrollCount + ' students</span>';
        html += '</div></a>';
    });
    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var courseId = parseInt(this.dataset.courseId);
            loadGradeEntry(courseId);
        });
    });

    if (courses.length > 0) loadGradeEntry(courses[0].id);
}

function loadGradeEntry(courseId) {
    var area = document.getElementById('gradeEntryArea');
    var course = getCourses().find(function(c) { return c.id === courseId; });
    if (!course) return;
    var enrollments = getEnrollments().filter(function(e) { return e.courseId === courseId; });
    var students = getStudents();
    var grades = getGrades();
    if (enrollments.length === 0) {
        area.innerHTML = '<div class="alert alert-warning">No students enrolled in ' + course.code + '.</div>';
        return;
    }
    var html = '<h5>' + course.code + ' - ' + course.title + '</h5><form id="gradeEntryForm"><div class="table-responsive"><table class="table table-sm table-bordered"><thead><tr><th>Student</th><th>Test (max 20)</th><th>Exam (max 80)</th><th>Total</th><th>Grade</th><th>Status</th></tr></thead><tbody>';
    enrollments.forEach(function(enrol) {
        var student = students.find(function(s) { return s.id === enrol.studentId; });
        var grade = grades.find(function(g) { return g.studentId === enrol.studentId && g.courseId === courseId; });
        var test = grade ? grade.test : '';
        var exam = grade ? grade.exam : '';
        var total = grade ? grade.total : '';
        var letter = grade ? grade.grade : '';
        var status = grade ? grade.status : 'Not entered';
        html += '<tr><td>' + (student ? student.name : 'Unknown') + '</td>';
        html += '<td><input type="number" class="form-control form-control-sm test-input" data-student="' + enrol.studentId + '" value="' + test + '" min="0" max="20"></td>';
        html += '<td><input type="number" class="form-control form-control-sm exam-input" data-student="' + enrol.studentId + '" value="' + exam + '" min="0" max="80"></td>';
        html += '<td class="total-display" data-student="' + enrol.studentId + '">' + total + '</td>';
        html += '<td class="grade-display" data-student="' + enrol.studentId + '">' + letter + '</td>';
        html += '<td>' + status + '</td></tr>';
    });
    html += '</tbody></table></div>';
    html += '<div class="d-flex flex-wrap gap-2 mt-3">';
    html += '<button type="button" class="btn btn-success btn-sm" id="submitGradesBtn"><i class="fas fa-paper-plane"></i> Submit for Approval</button>';
    html += '<button type="button" class="btn btn-secondary btn-sm" id="saveDraftBtn"><i class="fas fa-save"></i> Save Draft</button>';
    html += '</div></form>';
    area.innerHTML = html;

    area.querySelectorAll('.test-input, .exam-input').forEach(function(inp) {
        inp.addEventListener('input', function() {
            var studentId = parseInt(this.dataset.student);
            var test = parseFloat(document.querySelector('.test-input[data-student="' + studentId + '"]').value) || 0;
            var exam = parseFloat(document.querySelector('.exam-input[data-student="' + studentId + '"]').value) || 0;
            var total = test + exam;
            var grade = getLetterGrade(total);
            document.querySelector('.total-display[data-student="' + studentId + '"]').textContent = total;
            document.querySelector('.grade-display[data-student="' + studentId + '"]').textContent = grade;
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
}

function saveGradesFromForm(courseId, status) {
    var rows = document.querySelectorAll('#gradeEntryForm tbody tr');
    var grades = getGrades();
    var course = getCourses().find(function(c) { return c.id === courseId; });
    if (!course) return;

    rows.forEach(function(row) {
        var studentId = parseInt(row.querySelector('.test-input').dataset.student);
        var test = parseFloat(row.querySelector('.test-input').value) || 0;
        var exam = parseFloat(row.querySelector('.exam-input').value) || 0;
        var total = test + exam;
        var grade = getLetterGrade(total);
        var gp = getGradePoint(grade);

        var existing = grades.find(function(g) { return g.studentId === studentId && g.courseId === courseId; });
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
                studentId: studentId,
                courseId: courseId,
                courseCode: course.code,
                courseTitle: course.title,
                credit: course.credit,
                test: test,
                exam: exam,
                total: total,
                grade: grade,
                gp: gp,
                status: status
            });
        }
    });
    saveGrades(grades);
}

// ---- ADMIN (Simplified) ----
function renderAdminView() {
    renderAdminStudents();
    renderAdminLecturers();
    renderAdminCourses();
    renderAdminEnrollments();
    renderAdminApprovals();
    renderGradeChart();
}

function renderAdminStudents() {
    var students = getStudents();
    var html = '';
    if (students.length === 0) {
        html += '<tr><td colspan="6" class="text-muted">No students registered yet.</td></tr>';
    } else {
        students.forEach(function(s) {
            html += '<tr><td>' + s.id + '</td><td>' + s.name + '</td><td>' + s.email + '</td><td>' + s.program + '</td><td>' + s.level + '</td><td><button class="btn btn-sm btn-danger delete-student" data-id="' + s.id + '"><i class="fas fa-trash"></i></button></td></tr>';
        });
    }
    document.getElementById('adminStudentsList').innerHTML = html;

    document.querySelectorAll('.delete-student').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = parseInt(this.dataset.id);
            if (confirm('Delete this student?')) {
                var students = getStudents().filter(function(s) { return s.id !== id; });
                saveStudents(students);
                var users = getUsers().filter(function(u) { return u.studentId !== id; });
                saveUsers(users);
                var enrollments = getEnrollments().filter(function(e) { return e.studentId !== id; });
                saveEnrollments(enrollments);
                var grades = getGrades().filter(function(g) { return g.studentId !== id; });
                saveGrades(grades);
                renderAdminStudents();
                renderAdminEnrollments();
                renderAdminApprovals();
                renderGradeChart();
            }
        });
    });
}

function renderAdminLecturers() {
    var lecturers = getLecturers();
    var html = '';
    if (lecturers.length === 0) {
        html += '<tr><td colspan="5" class="text-muted">No lecturers added yet.</td></tr>';
    } else {
        lecturers.forEach(function(l) {
            html += '<tr><td>' + l.id + '</td><td>' + l.name + '</td><td>' + l.email + '</td><td>' + l.department + '</td><td><button class="btn btn-sm btn-danger delete-lecturer" data-id="' + l.id + '"><i class="fas fa-trash"></i></button></td></tr>';
        });
    }
    document.getElementById('adminLecturersList').innerHTML = html;

    document.querySelectorAll('.delete-lecturer').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = parseInt(this.dataset.id);
            if (confirm('Delete this lecturer?')) {
                var lecturers = getLecturers().filter(function(l) { return l.id !== id; });
                saveLecturers(lecturers);
                var users = getUsers().filter(function(u) { return u.lecturerId !== id; });
                saveUsers(users);
                var courses = getCourses();
                courses.forEach(function(c) {
                    if (c.lecturerId === id) c.lecturerId = null;
                });
                saveCourses(courses);
                renderAdminLecturers();
                renderAdminCourses();
            }
        });
    });
}

function renderAdminCourses() {
    var courses = getCourses();
    var lecturers = getLecturers();
    var html = '';
    if (courses.length === 0) {
        html += '<tr><td colspan="5" class="text-muted">No courses added yet.</td></tr>';
    } else {
        courses.forEach(function(c) {
            var lec = lecturers.find(function(l) { return l.id === c.lecturerId; });
            html += '<tr><td>' + c.code + '</td><td>' + c.title + '</td><td>' + c.credit + '</td><td>' + (lec ? lec.name : '⚠️ Unassigned') + '</td><td><button class="btn btn-sm btn-danger delete-course" data-id="' + c.id + '"><i class="fas fa-trash"></i></button></td></tr>';
        });
    }
    document.getElementById('adminCoursesList').innerHTML = html;

    document.querySelectorAll('.delete-course').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = parseInt(this.dataset.id);
            if (confirm('Delete this course?')) {
                var courses = getCourses().filter(function(c) { return c.id !== id; });
                saveCourses(courses);
                var enrollments = getEnrollments().filter(function(e) { return e.courseId !== id; });
                saveEnrollments(enrollments);
                var grades = getGrades().filter(function(g) { return g.courseId !== id; });
                saveGrades(grades);
                renderAdminCourses();
                renderAdminEnrollments();
                renderAdminApprovals();
                renderGradeChart();
            }
        });
    });
}

function renderAdminEnrollments() {
    var enrollments = getEnrollments();
    var students = getStudents();
    var courses = getCourses();
    var html = '';
    if (enrollments.length === 0) {
        html += '<tr><td colspan="5" class="text-muted">No enrollments yet.</td></tr>';
    } else {
        enrollments.forEach(function(e) {
            var student = students.find(function(s) { return s.id === e.studentId; });
            var course = courses.find(function(c) { return c.id === e.courseId; });
            html += '<tr><td>' + (student ? student.name : 'Unknown') + '</td><td>' + (course ? course.code : 'Unknown') + '</td><td>' + e.session + '</td><td>' + e.semester + '</td><td><button class="btn btn-sm btn-danger delete-enrollment" data-id="' + e.id + '"><i class="fas fa-trash"></i></button></td></tr>';
        });
    }
    document.getElementById('adminEnrollmentsList').innerHTML = html;

    document.querySelectorAll('.delete-enrollment').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = parseInt(this.dataset.id);
            if (confirm('Remove this enrollment?')) {
                var enrollments = getEnrollments().filter(function(e) { return e.id !== id; });
                saveEnrollments(enrollments);
                renderAdminEnrollments();
            }
        });
    });
}

function renderAdminApprovals() {
    var grades = getGrades().filter(function(g) { return g.status === 'submitted'; });
    var students = getStudents();
    var courses = getCourses();
    var html = '';
    if (grades.length === 0) {
        html += '<tr><td colspan="7" class="text-muted text-center">✅ No pending approvals.</td></tr>';
    } else {
        grades.forEach(function(g) {
            var student = students.find(function(s) { return s.id === g.studentId; });
            var course = courses.find(function(c) { return c.id === g.courseId; });
            html += '<tr><td>' + (student ? student.name : 'Unknown') + '</td><td>' + (course ? course.code : 'Unknown') + '</td><td>' + g.test + '</td><td>' + g.exam + '</td><td><strong>' + g.total + '</strong></td><td>' + g.grade + '</td><td><button class="btn btn-sm btn-success approve-grade" data-student="' + g.studentId + '" data-course="' + g.courseId + '">Approve</button> <button class="btn btn-sm btn-danger reject-grade" data-student="' + g.studentId + '" data-course="' + g.courseId + '">Reject</button></td></tr>';
        });
    }
    document.getElementById('adminApprovalsList').innerHTML = html;

    document.querySelectorAll('.approve-grade').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var studentId = parseInt(this.dataset.student);
            var courseId = parseInt(this.dataset.course);
            var grades = getGrades();
            var grade = grades.find(function(g) { return g.studentId === studentId && g.courseId === courseId; });
            if (grade) {
                grade.status = 'approved';
                saveGrades(grades);
                renderAdminApprovals();
                renderGradeChart();
            }
        });
    });
    document.querySelectorAll('.reject-grade').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var studentId = parseInt(this.dataset.student);
            var courseId = parseInt(this.dataset.course);
            var grades = getGrades();
            var grade = grades.find(function(g) { return g.studentId === studentId && g.courseId === courseId; });
            if (grade) {
                grade.status = 'draft';
                saveGrades(grades);
                renderAdminApprovals();
            }
        });
    });
}

// ---- GRADE CHART ----
var gradeChartInstance = null;
function renderGradeChart() {
    var grades = getGrades().filter(function(g) { return g.status === 'approved'; });
    var counts = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
    grades.forEach(function(g) {
        if (counts.hasOwnProperty(g.grade)) counts[g.grade]++;
    });
    var ctx = document.getElementById('gradeChart').getContext('2d');
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
