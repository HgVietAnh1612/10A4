// Lấy các phần tử cần thiết
const showRankLink = document.getElementById('showRankLink');
const showRankSidebar = document.getElementById('showRankSidebar');
const rankingTable = document.getElementById('rankingTable');
const blacklistLink = document.getElementById('blacklistLink');
const mainContent = document.getElementById('mainContent');
const iframeContainer = document.querySelector('.fixed-container'); // Lấy iframe
const groupLink = document.getElementById('groupLink'); // Liên kết đến mục "Các tổ"

// Hàm ẩn iframe
function hideIframe() {
    iframeContainer.style.display = 'none';
}

// Hàm hiển thị lại iframe
function showIframe() {
    iframeContainer.style.display = 'block';
}

// Hàm hiển thị bảng xếp hạng
function showRankingTable() {
    if (rankingTable.style.display === 'none' || rankingTable.style.display === '') {
        rankingTable.style.display = 'table'; // Hiển thị bảng
    } else {
        rankingTable.style.display = 'none'; // Ẩn bảng
    }
}

// Gán sự kiện nhấn cho "Rank"
showRankLink.addEventListener('click', (event) => {
    event.preventDefault(); // Ngăn chặn chuyển trang
    showRankingTable();
});

showRankSidebar.addEventListener('click', (event) => {
    event.preventDefault(); // Ngăn chặn chuyển trang
    showRankingTable();
});

// Mã code cần nhập để truy cập Black List
const requiredCode = '12345';

// Hàm lưu dữ liệu Blacklist vào LocalStorage
function saveBlacklistData() {
    const table = document.querySelector(".ranking-table tbody");
    const rows = Array.from(table.querySelectorAll("tr")).map(row => ({
        name: row.cells[1].textContent,
        group: row.cells[2].textContent,
        violations: row.cells[3].textContent,
        date: row.cells[4].textContent
    }));
    localStorage.setItem("blacklistData", JSON.stringify(rows));
}

// Hàm tải dữ liệu từ LocalStorage
function loadBlacklistData() {
    const storedData = localStorage.getItem("blacklistData");
    if (storedData) {
        const table = document.querySelector(".ranking-table tbody");
        const data = JSON.parse(storedData);
        data.forEach(item => {
            const newRow = `
                <tr>
                    <td><input type="checkbox" class="select-row"></td>
                    <td>${item.name}</td>
                    <td>${item.group}</td>
                    <td>${item.violations}</td>
                    <td>${item.date}</td>
                </tr>
            `;
            table.innerHTML += newRow;
        });
    }
}

// Hàm thêm hoặc cập nhật dữ liệu trong Black List
function addToBlacklist() {
    const name = prompt("Nhập họ tên:");
    const group = prompt("Nhập tổ:");
    const violation = prompt("Nhập các lỗi đã vi phạm:");

    if (name && group && violation) {
        const table = document.querySelector(".ranking-table tbody");
        const currentDate = new Date().toLocaleDateString(); // Lấy ngày hiện tại
        let found = false;

        // Duyệt qua các hàng trong bảng để kiểm tra trùng "Họ Tên" và "Tổ"
        const rows = table.querySelectorAll("tr");
        rows.forEach((row) => {
            const nameCell = row.cells[1].textContent.trim();
            const groupCell = row.cells[2].textContent.trim();

            if (nameCell === name && groupCell === group) {
                // Nếu tìm thấy, cập nhật cột "Các lỗi đã vi phạm"
                const violationCell = row.cells[3];
                const dateCell = row.cells[4];
                violationCell.textContent += `, ${violation}`;
                dateCell.textContent += `, ${currentDate}`;
                found = true;
            }
        });

        if (!found) {
            // Nếu không tìm thấy, thêm một hàng mới
            const newRow = `
                <tr>
                    <td><input type="checkbox" class="select-row"></td>
                    <td>${name}</td>
                    <td>${group}</td>
                    <td>${violation}</td>
                    <td>${currentDate}</td>
                </tr>
            `;
            table.innerHTML += newRow;
        }

        // Lưu dữ liệu sau khi thêm hoặc cập nhật
        saveBlacklistData();
        alert(found ? "Đã cập nhật lỗi vi phạm." : "Đã thêm vào Black List!");
    } else {
        alert("Vui lòng nhập đầy đủ thông tin.");
    }
}

// Hàm xoá các hàng đã tick
function deleteSelectedRows() {
    const table = document.querySelector(".ranking-table tbody");
    const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
        const checkbox = row.querySelector(".select-row");
        if (checkbox && checkbox.checked) {
            row.remove();
        }
    });

    // Lưu dữ liệu sau khi xóa
    saveBlacklistData();
}

// Cập nhật nội dung Black List với nút "Thêm" và "Xoá"
function showBlacklistContent() {
    // Ẩn iframe khi hiển thị nội dung Black List
    hideIframe();

    mainContent.innerHTML = `
        <h2>Black List</h2>
        <button id="addBlacklistButton">Thêm</button>
        <button id="deleteSelectedButton">Xoá mục đã chọn</button>
        <table class="ranking-table">
            <thead>
                <tr>
                    <th>Chọn</th>
                    <th>Họ Tên</th>
                    <th>Tổ</th>
                    <th>Các lỗi đã vi phạm</th>
                    <th>Ngày vi phạm</th>
                </tr>
            </thead>
            <tbody>
                <!-- Dữ liệu sẽ được nạp vào đây -->
            </tbody>
        </table>
    `;

    // Tải dữ liệu từ LocalStorage
    loadBlacklistData();

    // Gán sự kiện cho nút "Thêm"
    const addButton = document.getElementById("addBlacklistButton");
    addButton.addEventListener("click", addToBlacklist);

    // Gán sự kiện cho nút "Xoá"
    const deleteButton = document.getElementById("deleteSelectedButton");
    deleteButton.addEventListener("click", deleteSelectedRows);
}

// Hàm yêu cầu nhập mã code
function promptForCode() {
    const userCode = prompt("Nhập mã code để truy cập Black List:");
    if (userCode === requiredCode) {
        alert("Mã đúng! Bạn đã truy cập thành công.");
        showBlacklistContent();
    } else {
        alert("Mã sai! Bạn không thể truy cập.");
    }
}

// Gán sự kiện nhấn vào "Black list"
blacklistLink.addEventListener('click', (event) => {
    event.preventDefault(); // Ngăn chặn chuyển trang
    promptForCode();
});

// Hàm hiển thị bảng xếp hạng
function showRankingContent() {
    // Hiển thị lại iframe khi hiển thị bảng xếp hạng
    showIframe();

    mainContent.innerHTML = `
        <h2>Bảng Xếp Hạng</h2>
        <table id="rankingTable" class="ranking-table">
            <thead>
                <tr>
                    <th>Bảng xếp hạng</th>
                    <th>Tổ 1</th>
                    <th>Tổ 2</th>
                    <th>Tổ 3</th>
                    <th>Tổ 4</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Điểm trừ</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Điểm cộng</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Tổng</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    `;
}

// Gán sự kiện nhấn cho "Rank"
showRankLink.addEventListener('click', (event) => {
    event.preventDefault(); // Ngăn chặn chuyển trang
    showRankingContent();
});

showRankSidebar.addEventListener('click', (event) => {
    event.preventDefault(); // Ngăn chặn chuyển trang
    showRankingContent();
});

// Hàm hiển thị các ô vuông của các tổ
function showGroupSquares() {
    // Ẩn iframe khi hiển thị nội dung Các Tổ
    hideIframe();

    mainContent.innerHTML = `
        <h2>Các Tổ // chức năng hiện tại chưa hoàn thiện</h2>
        <div style="display: flex; gap: 20px;">
            <div style="width: 100px; height: 100px; background-color: lightblue; display: flex; justify-content: center; align-items: center;">Tổ 1</div>
            <div style="width: 100px; height: 100px; background-color: lightcoral; display: flex; justify-content: center; align-items: center;">Tổ 2</div>
            <div style="width: 100px; height: 100px; background-color: lightgreen; display: flex; justify-content: center; align-items: center;">Tổ 3</div>
            <div style="width: 100px; height: 100px; background-color: lightyellow; display: flex; justify-content: center; align-items: center;">Tổ 4</div>
        </div>
    `;
}

// Gán sự kiện nhấn vào "Các tổ"
groupLink.addEventListener('click', (event) => {
    event.preventDefault(); // Ngăn chặn chuyển trang
    showGroupSquares();
});
