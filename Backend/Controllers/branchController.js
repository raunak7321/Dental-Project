const Branch = require("../Models/branchModel");

exports.createBranch = async (req, res) => {
    try {
        const adminId = req.body.adminId;
        const branchCount = await Branch.countDocuments({ createdBy: adminId });

        if (branchCount >= 2) {
            return res.status(403).json({
                success: false,
                message: "You can only create up to 2 branches.",
            });
        }

        const { name, address, contact, pincode } = req.body;
        const branchNumber = branchCount + 1;
        const generatedId = `${branchNumber.toString().padStart(2, "0")}`;

        const newBranch = new Branch({
            name,
            address,
            contact,
            pincode,
            branchId: generatedId,
            createdBy: adminId,
        });

        await newBranch.save();

        res.status(201).json({
            success: true,
            message: "Branch created successfully",
            branch: newBranch,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating branch",
            error: error.message,
        });
    }
};

exports.getAllBranch = async (req, res) => {
    try {
        const branches = await Branch.find();

        res.status(200).json({
            success: true,
            branches,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching branches",
            error: error.message,
        });
    }
}

exports.getBranchById = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        res.status(200).json({
            success: true,
            branch,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching branch",
            error: error.message,
        });
    }
}

exports.updateBranchById = async (req, res) => {
    try {
        const { name, address, contact, pincode } = req.body;

        const updatedBranch = await Branch.findByIdAndUpdate(
            req.params.id,
            { name, address, contact, pincode },
            { new: true }
        );

        if (!updatedBranch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Branch updated successfully",
            branch: updatedBranch,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating branch",
            error: error.message,
        });
    }
}

exports.deleteBranchById = async (req, res) => {
    try {
        const deletedBranch = await Branch.findByIdAndDelete(req.params.id);

        if (!deletedBranch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Branch deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting branch",
            error: error.message,
        });
    }
}