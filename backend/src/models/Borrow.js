import mongoose from 'mongoose';

const MAX_BOOKS_PER_BORROW = 3;
const DEFAULT_BORROW_DURATION_DAYS = 20;
const EXTEND_DAYS = 15;
const MAX_EXTEND_TIMES = 1;

const borrowSchema = new mongoose.Schema(
  {
    reader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Thông tin độc giả là bắt buộc'],
    },
    books: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
          required: [true, 'Phải chọn sách để mượn'],
        },
        quantity: {
          type: Number,
          min: [1, 'Phải mượn ít nhất 1 cuốn'],
          required: [true, 'Số lượng sách mượn là bắt buộc'],
        },
      },
    ],
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    returnDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return value >= this.borrowDate;
        },
        message: 'Ngày trả không thể nhỏ hơn ngày mượn',
      },
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'late'],
      default: 'borrowed',
    },
    extendedTimes: {
      type: Number,
      default: 0,
      validate: {
        validator: function (val) {
          return val <= MAX_EXTEND_TIMES;
        },
        message: `Chỉ được gia hạn tối đa ${MAX_EXTEND_TIMES} lần.`,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

borrowSchema.pre('save', function (next) {
  const totalBooks = this.books.reduce((sum, b) => sum + b.quantity, 0);

  if (totalBooks > MAX_BOOKS_PER_BORROW) {
    return next(
      new Error(`Mỗi phiếu mượn chỉ được mượn tối đa ${MAX_BOOKS_PER_BORROW} cuốn sách.`)
    );
  }

  if (!this.dueDate) {
    const borrowDate = this.borrowDate || new Date();
    const calculatedDueDate = new Date(borrowDate);
    calculatedDueDate.setDate(calculatedDueDate.getDate() + DEFAULT_BORROW_DURATION_DAYS);
    this.dueDate = calculatedDueDate;
  }

  next();
});

borrowSchema.methods.checkStatus = function () {
  if (this.status === 'borrowed' && new Date() > this.dueDate) {
    this.status = 'late';
  }
};

export default mongoose.model('Borrow', borrowSchema);
