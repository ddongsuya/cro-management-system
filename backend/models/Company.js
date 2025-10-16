const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    department: {
      type: String,
      trim: true,
    },
    fax: {
      type: String,
      trim: true,
    },
  },
  { _id: true }
);

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      required: true,
      trim: true,
    },
    quotationName: {
      type: String,
      required: true,
      trim: true,
    },
    quotationAmount: {
      type: String,
      required: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },
    discountRate: String,
    paymentTerms: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const contractSchema = new mongoose.Schema(
  {
    contractNumber: {
      type: String,
      required: true,
      trim: true,
    },
    contractName: {
      type: String,
      required: true,
      trim: true,
    },
    contractAmount: {
      type: String,
      required: true,
    },
    contractPeriodStart: {
      type: Date,
      required: true,
    },
    contractPeriodEnd: {
      type: Date,
      required: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },
    contractSigningDate: Date,
    paymentTerms: String,
    taxInvoiceIssued: {
      type: Boolean,
      default: false,
    },
    taxInvoiceIssueDate: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const studySchema = new mongoose.Schema(
  {
    studyNumber: {
      type: String,
      required: true,
      trim: true,
    },
    studyName: {
      type: String,
      required: true,
      trim: true,
    },
    studyDirector: {
      type: String,
      required: true,
      trim: true,
    },
    studyPeriodStart: {
      type: Date,
      required: true,
    },
    studyPeriodEnd: {
      type: Date,
      required: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },
    testingStandards: {
      type: String,
      enum: [
        "KGLP",
        "NGLP",
        "OECD GLP",
        "ICH",
        "FDA GLP",
        "ISO 10993",
        "Other",
        "",
      ],
    },
    substanceInfo: {
      type: String,
      enum: [
        "Small molecule",
        "Peptide / Protein",
        "Antibody",
        "Cell therapy",
        "Gene therapy",
        "Vaccine",
        "Medical device",
        "Combination product",
        "Other",
        "",
      ],
    },
    submissionPurpose: {
      type: String,
      enum: [
        "MFDS",
        "FDA",
        "EMA",
        "PMDA",
        "Health Canada",
        "TGA",
        "Internal R&D",
        "Other",
        "",
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    mainPhoneNumber: {
      type: String,
      trim: true,
    },
    contacts: [contactSchema],
    notes: {
      type: String,
      trim: true,
    },
    quotations: [quotationSchema],
    contracts: [contractSchema],
    studies: [studySchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
companySchema.index({ userId: 1, name: 1 });
companySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Company", companySchema);
