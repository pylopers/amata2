// backend/controllers/dashboardController.js
import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';
import { Parser } from 'json2csv';        // npm install json2csv

export const getDashboardStats = async (req, res) => {
  try {
    const end = req.query.endDate
      ? new Date(req.query.endDate + 'T23:59:59')
      : new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 6);

    // 1️⃣ Global counts
    const totalUsers    = await userModel.countDocuments();
    const totalOrders   = await orderModel.countDocuments();
    const totalProducts = await productModel.countDocuments();

    // 2️⃣ Revenue sum
    const revenueAgg = await orderModel.aggregate([
      { $group: { _id: null, sum: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.sum || 0;

    // 3️⃣ Stock counts
    const inStockCount  = await productModel.countDocuments({ inStock: true });
    const outStockCount = await productModel.countDocuments({ inStock: false });

    // 4️⃣ Daily sales
    const dailySales = await orderModel.aggregate([
      { $match: { date: { $gte: +start, $lte: +end } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$date" } } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 5️⃣ New users over the same window
    const newUsers = await userModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 6️⃣ Orders by status
    const statusBreakdown = await orderModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        inStockCount,
        outStockCount,
        dailySales,
        newUsers,
        statusBreakdown
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 7️⃣ Frequent users endpoint
export const getFrequentUsers = async (req, res) => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // find users with >2 orders in past year
    const agg = await orderModel.aggregate([
      { $match: { date: { $gte: +oneYearAgo } } },
      { $group: { _id: '$userId', orderCount: { $sum: 1 } } },
      { $match: { orderCount: { $gt: 2 } } }
    ]);

    // fetch user details
    const userIds = agg.map(x => x._id);
    const users = await userModel.find({ _id: { $in: userIds } })
      .select('name email');

    res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 8️⃣ Download frequent users as CSV
export const downloadFrequentUsers = async (req, res) => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const agg = await orderModel.aggregate([
      { $match: { date: { $gte: +oneYearAgo } } },
      { $group: { _id: '$userId', orderCount: { $sum: 1 } } },
      { $match: { orderCount: { $gt: 2 } } }
    ]);

    const userIds = agg.map(x => x._id);
    const users = await userModel.find({ _id: { $in: userIds } })
      .select('name email');

    const parser = new Parser({ fields: ['_id', 'name', 'email'] });
    const csv = parser.parse(users);

    res.header('Content-Type', 'text/csv');
    res.attachment('frequent_users.csv');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
