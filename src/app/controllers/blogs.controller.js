import BlogModel from "../models/blog.model";
import AppError from "../../utils/appError";

export const createBlog = async (req, res) => {
    try {
        const { category_id } = req.params;
        const { title, content, thumnail } = req.body;
        const blogDoc = await BlogModel.create({category_id:category_id,title:title,content:content,thumnail:thumnail});
        res.status(200).json(blogDoc)
    } catch (error) {
        console.error("Error during Error creation:", error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: error.toString() });
        }
    }
};
export const getAllBlog = async (req, res,next) => {
    try {
        const getAllDoc = await BlogModel.findAll();
        res.status(200).json(getAllDoc)

    } catch (error) {
        next(error)
    }
};

export const getBlogById = async (req, res) => {
    try {
        const BlogId = await BlogModel.findByPk(req.params.id);
        if (!BlogId) {
            res.status(404).json({ error: 'Blog Id not found' });
        } else {
            res.status(200).json(BlogId);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
