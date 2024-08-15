// Button Status
const buttonStatus = document.querySelectorAll("[button-status]");  // thuộc tinh tự định nghĩa thì thêm [] vào
if(buttonStatus.length > 0) {
  let url = new URL(window.location.href); // URL chứa sẵn một số hàm giúp xử lý, thêm, sửa, xóa các tham số trên URL
  buttonStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      if(status) {
        url.searchParams.set("status", status); // set thêm tham số vào URL
      }
      else {
        url.searchParams.delete("status");
      }
      // console.log(url.href);
      window.location.href = url.href;
    })
  })
}
// End Button Status

// Form Search
const formSearch = document.querySelector("#form-search");
if(formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault(); // ngăn load lại trang khi submit form
    const keyword = e.target.elements.keyword.value;
    if(keyword) {
      url.searchParams.set("keyword", keyword);
    }
    else{
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  })
}
// End Form Search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if(buttonsPagination) {
  let url = new URL(window.location.href);
  buttonsPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      url.searchParams.set("page", page);
      window.location.href = url.href;
    })
  })
}
// End Pagination


// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputIds = checkboxMulti.querySelectorAll("input[name='id']");
  inputCheckAll.addEventListener("click", () => {

    // Logic khi click vào ô checkall thì tất cả các ô khác cũng check và ngược lại
    // console.log(inputCheckAll.checked);
    if(inputCheckAll.checked) {
      inputIds.forEach((input) => {
        input.checked = true;
      })
    }
    else {
      inputIds.forEach((input) => {
        input.checked = false;
      }) 
    }


    // // Logic khi bỏ tick 1 ô thì ô checkall cũng bỏ tick và nếu có đủ tất cả các ô thì ô checkall cũng tick
    // //C1
    // inputIds.forEach(input => {
    //   input.addEventListener("click", () => {
    //     let check = true;
    //     inputIds.forEach(input => {
    //       if(!input.checked) {
    //         check = false;
    //       }
    //     })
    //     if(check) {
    //       inputCheckAll.checked = true;
    //     }
    //     else {
    //       inputCheckAll.checked = false;
    //     }
    //   })
    // })

    //C2
    inputIds.forEach((input) => {
      input.addEventListener("click", () => {
        const countChecked = checkboxMulti.querySelectorAll(
          "input[name='id']:checked"
        ).length;
        if(countChecked == inputIds.length) {
          inputCheckAll.checked = true;
        }
        else {
          inputCheckAll.checked = false;
        }
      })
    })
  })
}
// End Checkbox Multi


// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi");
    const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

    const typeChange = e.target.elements.type.value;
    
    if(typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có chắc muốn xóa tất cả sản phẩm ?");
      if(!isConfirm) {
        return;
      }
    }

    if(inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      inputsChecked.forEach((input) => {
        const id = input.value;
        if(typeChange == "change-position") {
          const position = input.closest("tr").querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        }
        else {
          ids.push(id);
        }
      })
      inputIds.value = ids.join(", ");
      formChangeMulti.submit();
    }
    else {
      alert("Bạn chưa chọn bản ghi nào");
    }
  })
}
// End Form Change Multi


// Show Alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");
  setTimeout( () => {
    showAlert.classList.add("alert-hidden");
  }, time)
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  })
}
// End Show Alert


// Upload Image
const uploadImage = document.querySelector("[upload-image");
if(uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input");
  const uploadImagePreview = document.querySelector("[upload-image-preview");

  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if(file){
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  })
}
// End Upload Image


// Sort
const sort = document.querySelector("[sort]");
if(sort) {
  let url = new URL(window.location.href);
  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");
  
  // Sắp xếp
  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    window.location.href = url.href;
  })

  // Xóa sắp xếp
  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
  })

  // Thêm selected cho option được chọn
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  if(sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`;
    const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
    optionSelected.selected = true;
  }

}
// End Sort