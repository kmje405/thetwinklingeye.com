document.addEventListener("DOMContentLoaded", function () {
  // Handle both desktop and mobile category dropdowns
  const categoryDropdowns = [
    document.getElementById("categories-dropdown"),
    document.getElementById("categories-dropdown-mobile"),
  ].filter(Boolean); // Remove null elements

  categoryDropdowns.forEach(function (categoryDropdown) {
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
});
