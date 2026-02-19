// ================================
// MarketPro Dark Mode + M-Pesa + Upload + Live Showcase
// ================================

document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------
  // 1️⃣ Dark Mode Styles
  // ----------------------------
  const darkModeStyles = `
    body, html { background: #111827; color: #f4f7fb; }
    .navbar { background: #1f2937; color: #f4f7fb; }
    .nav-links a { color: #f4f7fb; }
    .hero { background: linear-gradient(135deg, #2563eb, #16a34a); }
    .hero-content h1, .hero-content p { color: #f4f7fb; }
    .btn-primary { background: #2563eb; color: #f4f7fb; }
    .card, .pricing-card, .container { background: #1f2937; color: #f4f7fb; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
    input { background: #374151; color: #f4f7fb; border: 1px solid #6b7280; }
    .btn-pay { background: #16a34a; color: #f4f7fb; }
    footer { background: #1f2937; color: #f4f7fb; }
    .image-gallery img, .hero img { filter: brightness(0.9); }
  `;
  const styleTag = document.createElement("style");
  styleTag.textContent = darkModeStyles;
  document.head.appendChild(styleTag);

  // ----------------------------
  // 2️⃣ Simulated M-Pesa Payment
  // ----------------------------
  const paymentForm = document.getElementById("paymentForm");
  const statusDiv = document.getElementById("status");
  const payBtn = paymentForm.querySelector(".btn-pay");
  const customerUploadSection = document.getElementById("customerUpload");

  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const businessName = paymentForm
      .querySelector('input[name="businessName"]')
      .value.trim();
    const email = paymentForm.querySelector('input[name="email"]').value.trim();
    let phone = paymentForm.querySelector('input[name="phone"]').value.trim();
    const amount = paymentForm
      .querySelector('input[name="amount"]')
      .value.trim();

    if (!businessName || !email || !phone || !amount) {
      statusDiv.textContent = "❌ Please fill all fields correctly.";
      statusDiv.style.color = "red";
      return;
    }

    // Format phone to 2547XXXXXXXX
    if (phone.startsWith("0")) phone = "254" + phone.slice(1);
    else if (phone.startsWith("+")) phone = phone.slice(1);

    if (!/^2547\d{8}$/.test(phone)) {
      statusDiv.textContent = "❌ Invalid M-Pesa number (e.g., 0712XXXXXXX)";
      statusDiv.style.color = "red";
      return;
    }

    // Show processing
    statusDiv.textContent = `⏳ Requesting M-Pesa prompt for ${businessName}...`;
    statusDiv.style.color = "#27ae60";
    payBtn.disabled = true;
    payBtn.textContent = "Processing...";

    // Simulate Payment
    setTimeout(() => {
      statusDiv.innerHTML = `✅ Payment received! Welcome, <strong>${businessName}</strong>!`;
      payBtn.disabled = false;
      payBtn.textContent = "Pay via M-Pesa";

      // Show Upload Section
      customerUploadSection.style.display = "block";
      customerUploadSection.scrollIntoView({ behavior: "smooth" });
    }, 2000); // 2s simulation
  });

  // ----------------------------
  // 3️⃣ Handle Upload Form + Live Showcase
  // ----------------------------
  const uploadForm = document.getElementById("uploadForm");
  const uploadStatus = document.getElementById("uploadStatus");
  const showcaseGallery = document.querySelector("#showcase .image-gallery");

  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const businessName = uploadForm
      .querySelector('input[name="businessNameUpload"]')
      .value.trim();
    const description = uploadForm
      .querySelector('input[name="description"]')
      .value.trim();
    const files = uploadForm.querySelector('input[name="images"]').files;

    if (!businessName || !description || files.length === 0) {
      uploadStatus.textContent =
        "❌ Fill all fields and select at least one image.";
      uploadStatus.style.color = "red";
      return;
    }

    uploadStatus.textContent =
      "✅ Upload successful! Your business is now live!";
    uploadStatus.style.color = "#27ae60";

    // Display uploaded images in Success Stories
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement("img");
        img.src = event.target.result;
        img.alt = businessName;

        // Append to existing showcase gallery
        showcaseGallery.appendChild(img);
      };
      reader.readAsDataURL(file);
    });

    // Reset upload form
    uploadForm.reset();
  });
});

uploadForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const businessName = uploadForm
    .querySelector('input[name="businessNameUpload"]')
    .value.trim();

  const description = uploadForm
    .querySelector('input[name="description"]')
    .value.trim();

  const files = uploadForm.querySelector('input[name="images"]').files;

  if (!businessName || !description || files.length === 0) {
    uploadStatus.textContent =
      "❌ Fill all fields and select at least one image.";
    uploadStatus.style.color = "red";
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    const imageData = event.target.result;

    const newBusiness = {
      name: businessName,
      description: description,
      image: imageData,
    };

    // Get existing businesses
    const businesses =
      JSON.parse(localStorage.getItem("marketProBusinesses")) || [];

    businesses.push(newBusiness);

    // Save back to localStorage
    localStorage.setItem("marketProBusinesses", JSON.stringify(businesses));

    uploadStatus.textContent =
      "✅ Upload successful! Business saved permanently.";
    uploadStatus.style.color = "#27ae60";

    uploadForm.reset();
  };

  reader.readAsDataURL(files[0]);
});
