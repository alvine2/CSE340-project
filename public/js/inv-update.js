const form = document.querySelector("#updateForm")

if (form) {
    const updateBtn = document.querySelector("#submitBtn")
  
    form.addEventListener("change", function () {
        updateBtn.disabled = false
    })
    
    form.addEventListener("input", function () {
        updateBtn.disabled = false
    })
    
    console.log("Update form detection enabled")
}