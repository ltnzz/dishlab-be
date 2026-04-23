import prisma from '../../config/prisma.client.js'
import CustomError from '../utils/custom.error.js'
import asyncHandler from '../utils/async.handler.js'

export const getAllRecipes = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, sort, category, kesulitan } = req.query

    const skip = (page - 1) * limit

    const where = {
        ...(search && {
            nama: {
                contains: search,
                mode: 'insensitive',
            },
        }),

        ...(category && {
            category: category,
        }),

        ...(kesulitan && {
            kesulitan: kesulitan,
        }),
    }

    let orderBy = { created_at: 'desc' }

    if (sort === 'latest') orderBy = { created_at: 'desc' }
    if (sort === 'oldest') orderBy = { created_at: 'asc' }
    if (sort === 'easy') orderBy = { kesulitan: 'asc' }

    const [recipes, total] = await Promise.all([
        prisma.recipes.findMany({
            where,
            skip: Number(skip),
            take: Number(limit),
            orderBy,
            include: {
                ingredients: true,
                steps: {
                    orderBy: { urutan: 'asc' },
                },
            },
        }),

        prisma.recipes.count({ where }),
    ])

    res.status(200).json({
        success: true,
        data: recipes,
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
        },
    })
})

export const getRecipeById = asyncHandler(async (req, res) => {
    const { id } = req.params

    const recipe = await prisma.recipes.findUnique({
        where: { id },
        include: {
            ingredients: true,
            steps: {
                orderBy: { urutan: 'asc' },
            },
        },
    })

    if (!recipe) {
        throw new CustomError('Recipe not found', 404)
    }

    res.status(200).json({
        success: true,
        data: recipe,
    })
})

export const createRecipe = asyncHandler(async (req, res) => {
    const { nama, deskripsi, category, kesulitan, waktu_masak, porsi, gambar, ingredients, steps } =
        req.body

    if (!nama || !kesulitan) {
        throw new CustomError('Nama & kesulitan wajib', 400)
    }

    const result = await prisma.$transaction(async (tx) => {
        const recipe = await tx.recipes.create({
            data: {
                nama,
                deskripsi,
                category,
                kesulitan,
                waktu_masak,
                porsi,
                gambar,
            },
        })

        if (Array.isArray(ingredients) && ingredients.length > 0) {
            await tx.ingredients.createMany({
                data: ingredients
                    .filter((i) => i.nama)
                    .map((i) => ({
                        recipe_id: recipe.id,
                        nama: i.nama,
                        jumlah: i.jumlah || null,
                        satuan: i.satuan || null,
                    })),
            })
        }

        if (Array.isArray(steps) && steps.length > 0) {
            await tx.steps.createMany({
                data: steps
                    .filter((s) => s.deskripsi)
                    .map((s, index) => ({
                        recipe_id: recipe.id,
                        urutan: s.urutan ?? index + 1,
                        deskripsi: s.deskripsi,
                    })),
            })
        }

        return recipe
    })

    res.status(201).json({
        success: true,
        data: result,
    })
})

export const deleteRecipe = asyncHandler(async (req, res) => {
    const { id } = req.params

    const recipe = await prisma.recipes.findUnique({
        where: { id },
    })

    if (!recipe) {
        throw new CustomError('Recipe not found', 404)
    }

    await prisma.recipes.delete({
        where: { id },
    })

    res.status(200).json({
        success: true,
        message: 'Recipe deleted successfully',
    })
})
