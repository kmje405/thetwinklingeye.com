document.addEventListener("DOMContentLoaded", function () {
  const categoryDropdown = document.getElementById("categories-dropdown");
  if (categoryDropdown) {
    categoryDropdown.addEventListener("change", function () {
      const selectedValue = this.value;
      if (selectedValue) {
        // Add a small delay to show the selection feedback
        setTimeout(function () {
          window.location.href = selectedValue;
        }, 100);
      }
    });
  }
});
