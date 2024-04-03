import chat from '../chat/statusMessage';
import { Product } from '../entities/Product';
import { InvalidFormatError, NotFoundError, UnauthorizedError } from '../helpers/api-error';
import { ProductRepository } from '../repositories/productRepository';
import { Request, Response } from 'express';
import { fileUpload } from '../services/imageUpload';
import { updateImage } from '../services/updateImage';
import deleteImage from '../services/deleteImage';

export class ProductController {
  async index(_: Request, res: Response): Promise<Response<Product[]>> {
    const products: Product[] = await ProductRepository.find();

    if (products.length === 0) {
      throw new NotFoundError(chat.error404);
    }

    return res.status(200).json(products);
  }

  async show(req: Request, res: Response): Promise<Response<Product>> {
    const { id } = req.params;

    const productId: number = parseInt(id);

    const products: Product[] = await ProductRepository.find({ where: { id: productId } });

    if (products.length === 0) {
      throw new NotFoundError(chat.error404);
    }

    const product: Product = products[0];

    return res.status(200).json(product);
  }

  async store(req: Request, res: Response): Promise<Response<Product>> {
    const { name, price, description, stock, category_id } = req.body;
    let avatar: Express.Multer.File | undefined = req.file;

    if (!name || !price || !description || !stock || !category_id) {
      throw new InvalidFormatError(chat.error400);
    }

    if (avatar) {
      const newImage = await fileUpload(name, 'products', avatar);

      const newProduct: Omit<Product, 'id'> = {
        name,
        price,
        description,
        stock,
        category_id,
        avatar: newImage
      };

      const SavedProduct: Product = await ProductRepository.create(newProduct);
      await ProductRepository.save(SavedProduct);

      return res.status(201).json();
    }

    const newProduct: Omit<Product, 'id'> = {
      name,
      price,
      description,
      stock,
      category_id,
      avatar: ''
    };

    const SavedProduct: Product = await ProductRepository.create(newProduct);
    await ProductRepository.save(SavedProduct);

    return res.status(201).json();
  }

  async update(req: Request, res: Response): Promise<Response<void>> {
    const { name, price, description, stock, category_id } = req.body;
    let avatar: Express.Multer.File | undefined = req.file;
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new InvalidFormatError(chat.error400);
    }

    const productId: number = parseInt(id);

    if (!id || isNaN(productId)) {
      throw new InvalidFormatError(chat.error400);
    }

    const product: Product | null = await ProductRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundError(chat.error404);
    }

    if (avatar) {
      const newImage = await updateImage(product, 'products', avatar);

      const productData: Partial<Product> = {
        name: name || product.name,
        price: price || product.price,
        description: description || product.description,
        stock: stock || product.stock,
        category_id: category_id || product.category_id,
        avatar: newImage
      };

      Object.assign(product, productData);

      if (productId !== product.id) {
        throw new UnauthorizedError(chat.error401);
      }

      await ProductRepository.save(product);

      return res.status(200).json();
    }

    const productData: Partial<Product> = {
      name: name || product.name,
      price: price || product.price,
      description: description || product.description,
      stock: stock || product.stock,
      category_id: category_id || product.category_id
    };

    Object.assign(product, productData);

    if (productId !== product.id) {
      throw new UnauthorizedError(chat.error401);
    }

    await ProductRepository.save(product);

    return res.status(200).json();
  }

  async destroy(req: Request, res: Response): Promise<Response<void>> {
    const { id } = req.params;

    const productId: number = parseInt(id);

    if (!id || isNaN(productId)) {
      throw new InvalidFormatError(chat.error400);
    }

    const product: Product | null = await ProductRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundError(chat.error404);
    }

    const avatar: string | undefined = product.avatar;

    if (avatar) {
      await deleteImage(avatar, 'products');
    }

    await ProductRepository.delete(product);

    return res.status(203).json();
  }
}
