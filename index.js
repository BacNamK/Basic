const sb = document.getElementById("sub");

function getRandome(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Lắng nghe sự Kiện lưu
sb.addEventListener("click", () => {
  const nam = document.getElementById("name");
  const tim = document.getElementById("time");
  const de = document.getElementById("descr");

  if (nam.value === "") {
    nam.style.border = "1px solid red";
    return;
  }
  // Tạo Object
  const todo = {
    id: getRandome(1, 100),
    name: nam.value,
    time: tim.value,
    descr: de.value,
  };

  // Dữ liệu lưu trong local là dạng String
  const ttStr = localStorage.getItem("todo");

  if (ttStr) {
    // parse chuyển String -> Object
    const check = JSON.parse(ttStr);
    check.push(todo);
    // stringify chuyển Object -> String
    localStorage.setItem("todo", JSON.stringify(check));
  } else {
    localStorage.setItem("todo", JSON.stringify([todo]));
  }

  // Mỗi lần lưu thì phải in ra ngay lập tức
  prinft();

  // Gán sự kiện xóa ngay khi tạo ra để không phải load lại trang mới có thể xóa
  hanldid();
});

const tb = document.querySelector("#print");

const prinft = () => {
  const times = getTime();

  // Lấy dữ liệu từ local
  const ttStr = localStorage.getItem("todo");
  const tbody = document.querySelector("#print .view");
  if (ttStr) {
    // chuyển String -> Object
    const obtt = JSON.parse(ttStr);
    // load lại tránh ghi lại dữ liệu lần nữa
    tbody.innerHTML = ``;
    if (obtt && obtt.length) {
      obtt.forEach((element) => {
        const t = times.find((x) => x.id === element.id);
        tbody.innerHTML += `
        <div class="out">
            <div class="shell_in">
                <div class="in">
                    <div class="nameT">${element.name}</div>
                    <div class="timeT">${t ? t.text : ""}</div>
                </div>
                <div class="dec"><span class="arrow">&#9660;</span> </div>
                <div class="bt">  
                    ${
                      /*<button class="btndo"><img class="iconb" src="./img/check.png"></button>*/ ""
                    }
                    <button class="btnde" data-id="${
                      element.id
                    }"><img class="iconb" src="./img/trash.png"></button>
                </div>
            </div>
            <div class="detail"><div class="detail_son">${
              element.descr
            }</div></div>
        </div>
        `;
      });
    }
  }
};

prinft();

//descri
document.querySelectorAll(".dec .arrow").forEach((arrow) => {
  arrow.addEventListener("click", () => {
    // tìm div .detail cùng cấp cha
    let parent = arrow.closest(".out");
    let detailDiv = parent.querySelector(".detail");

    // toggle hiển thị
    if (detailDiv.style.display === "none") {
      detailDiv.style.display = "block";
      arrow.innerHTML = "&#9650;";
    } else {
      detailDiv.style.display = "none";
      arrow.innerHTML = "&#9660;";
    }
  });
});

// Chức năng xóa
const deletebtn = document.querySelectorAll(".btnde");
deletebtn.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    // lấy id ở của phần tử user click
    const id = btn.getAttribute("data-id");
    hanldid(id);
  });
});

const hanldid = (id) => {
  const ttStr = localStorage.getItem("todo");
  if (ttStr) {
    const ttob = JSON.parse(ttStr);

    // Giữ lại id khác với id user click ở phía trên
    // newtodo ở đây là mảng mưới sau khi lọc
    const newtodo = ttob.filter((element, inex) => element.id + "" !== id);
    localStorage.setItem("todo", JSON.stringify(newtodo));
    window.location.reload();
  }
};

function buildDateFromTimeString(timeStr) {
  const today = new Date();
  const [hour, minute] = timeStr.split(":");
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    hour,
    minute
  );
}
function getTime() {
  const de = localStorage.getItem("todo");
  if (!de) return [];

  const deStr = JSON.parse(de);
  const now = new Date();

  return deStr.map((t) => {
    // nếu t.time chỉ là HH:mm thì thêm ngày hôm nay
    let deadline;
    if (/^\d{2}:\d{2}$/.test(t.time)) {
      const [hh, mm] = t.time.split(":");
      deadline = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        parseInt(hh),
        parseInt(mm),
        0
      );
    } else {
      // nếu đã là định dạng chuẩn ISO (2025-09-08T12:30) thì parse trực tiếp
      deadline = new Date(t.time);
    }

    const diff = deadline - now;

    if (isNaN(diff)) {
      return { id: t.id, text: "Invalid time" };
    }

    if (diff <= 0) {
      return { id: t.id, text: "Time Out" };
    } else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return {
        id: t.id,
        text: ` ${hours}h ${minutes}m`,
      };
    }
  });
}
setInterval(() => {
  prinft(), window.location.reload();
}, 60000);
