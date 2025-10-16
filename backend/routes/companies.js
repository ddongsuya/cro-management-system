const express = require("express");
const { body, validationResult } = require("express-validator");
const Company = require("../models/Company");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/companies
// @desc    Get all companies for the authenticated user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { userId: req.user._id, isActive: true };

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { "contacts.name": { $regex: search, $options: "i" } },
        { "contacts.email": { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const companies = await Company.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Company.countDocuments(query);

    res.json({
      companies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/companies/:id
// @desc    Get a specific company
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    console.error("Get company error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/companies
// @desc    Create a new company
// @access  Private
router.post(
  "/",
  auth,
  [
    body("name").notEmpty().trim().withMessage("Company name is required"),
    body("address").optional().trim(),
    body("website").optional().trim(),
    body("mainPhoneNumber").optional().trim(),
    body("notes").optional().trim(),
    body("contacts").isArray().withMessage("Contacts must be an array"),
    body("contacts.*.name").notEmpty().withMessage("Contact name is required"),
    body("contacts.*.email")
      .optional()
      .isEmail()
      .withMessage("Invalid email format"),
    body("contacts.*.phone").optional().trim(),
    body("contacts.*.department").optional().trim(),
    body("contacts.*.fax").optional().trim(),
    body("contacts.*.isPrimary").optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        address,
        website,
        mainPhoneNumber,
        notes,
        contacts,
        quotations,
        contracts,
        studies,
      } = req.body;

      // Check if company name already exists for this user
      const existingCompany = await Company.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        userId: req.user._id,
        isActive: true,
      });

      if (existingCompany) {
        return res
          .status(400)
          .json({ message: "Company with this name already exists" });
      }

      // Clean up contacts data - remove id and _id fields from frontend
      const cleanedContacts = contacts.map((contact) => {
        const { id, _id, ...cleanContact } = contact;
        return cleanContact;
      });

      // Ensure at least one primary contact
      const primaryContacts = cleanedContacts.filter((c) => c.isPrimary);
      if (primaryContacts.length === 0 && cleanedContacts.length > 0) {
        cleanedContacts[0].isPrimary = true;
      } else if (primaryContacts.length > 1) {
        // Only keep the first primary contact
        cleanedContacts.forEach((contact, index) => {
          if (index > 0) contact.isPrimary = false;
        });
      }

      // Clean up nested data - remove id fields and invalid contactId references
      const cleanedQuotations = (quotations || []).map((q) => {
        const { id, _id, contactId, ...cleanQ } = q;
        return cleanQ;
      });

      const cleanedContracts = (contracts || []).map((c) => {
        const { id, _id, contactId, ...cleanC } = c;
        return cleanC;
      });

      const cleanedStudies = (studies || []).map((s) => {
        const { id, _id, contactId, ...cleanS } = s;
        return cleanS;
      });

      const company = new Company({
        name,
        address,
        website,
        mainPhoneNumber,
        notes,
        contacts: cleanedContacts,
        quotations: cleanedQuotations,
        contracts: cleanedContracts,
        studies: cleanedStudies,
        userId: req.user._id,
      });

      await company.save();

      res.status(201).json({
        message: "Company created successfully",
        company,
      });
    } catch (error) {
      console.error("Create company error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/companies/:id
// @desc    Update a company
// @access  Private
router.put(
  "/:id",
  auth,
  [
    body("name")
      .optional()
      .notEmpty()
      .trim()
      .withMessage("Company name cannot be empty"),
    body("address").optional().trim(),
    body("website").optional().trim(),
    body("mainPhoneNumber").optional().trim(),
    body("notes").optional().trim(),
    body("contacts")
      .optional()
      .isArray()
      .withMessage("Contacts must be an array"),
    body("contacts.*.name")
      .optional()
      .notEmpty()
      .withMessage("Contact name is required"),
    body("contacts.*.email")
      .optional()
      .isEmail()
      .withMessage("Invalid email format"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const company = await Company.findOne({
        _id: req.params.id,
        userId: req.user._id,
        isActive: true,
      });

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const {
        name,
        address,
        website,
        mainPhoneNumber,
        notes,
        contacts,
        quotations,
        contracts,
        studies,
      } = req.body;

      // Check if new name conflicts with existing companies
      if (name && name !== company.name) {
        const existingCompany = await Company.findOne({
          name: { $regex: new RegExp(`^${name}$`, "i") },
          userId: req.user._id,
          isActive: true,
          _id: { $ne: req.params.id },
        });

        if (existingCompany) {
          return res
            .status(400)
            .json({ message: "Company with this name already exists" });
        }
      }

      // Update fields
      if (name !== undefined) company.name = name;
      if (address !== undefined) company.address = address;
      if (website !== undefined) company.website = website;
      if (mainPhoneNumber !== undefined)
        company.mainPhoneNumber = mainPhoneNumber;
      if (notes !== undefined) company.notes = notes;
      if (contacts !== undefined) {
        // Ensure at least one primary contact
        const primaryContacts = contacts.filter((c) => c.isPrimary);
        if (primaryContacts.length === 0 && contacts.length > 0) {
          contacts[0].isPrimary = true;
        }
        company.contacts = contacts;
      }
      if (quotations !== undefined) company.quotations = quotations;
      if (contracts !== undefined) company.contracts = contracts;
      if (studies !== undefined) company.studies = studies;

      await company.save();

      res.json({
        message: "Company updated successfully",
        company,
      });
    } catch (error) {
      console.error("Update company error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   DELETE /api/companies/:id
// @desc    Delete a company (soft delete)
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Soft delete
    company.isActive = false;
    await company.save();

    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Delete company error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/companies/:id/quotations
// @desc    Add a quotation to a company
// @access  Private
router.post(
  "/:id/quotations",
  auth,
  [
    body("quotationNumber")
      .notEmpty()
      .trim()
      .withMessage("Quotation number is required"),
    body("quotationName")
      .notEmpty()
      .trim()
      .withMessage("Quotation name is required"),
    body("quotationAmount")
      .notEmpty()
      .withMessage("Quotation amount is required"),
    body("contactId").optional().isMongoId().withMessage("Invalid contact ID"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const company = await Company.findOne({
        _id: req.params.id,
        userId: req.user._id,
        isActive: true,
      });

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const quotation = req.body;
      company.quotations.push(quotation);
      await company.save();

      res.status(201).json({
        message: "Quotation added successfully",
        quotation: company.quotations[company.quotations.length - 1],
      });
    } catch (error) {
      console.error("Add quotation error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
