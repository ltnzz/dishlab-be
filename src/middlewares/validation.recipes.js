import CustomError from '../utils/custom.error.js'

export const validateRecipeCreation = (req, res, next) => {
    const { nama, kesulitan, category, waktu_masak, porsi, ingredients, steps } = req.body

    if (!nama || !kesulitan || !category) {
        return next(new CustomError('nama, kesulitan, category wajib diisi', 400))
    }

    if (!Array.isArray(ingredients) || ingredients.length < 1) {
        return next(new CustomError('Minimal 1 ingredient wajib diisi', 400))
    }

    const invalidIngredient = ingredients.some((i) => !i.nama || i.nama.trim() === '')

    if (invalidIngredient) {
        return next(new CustomError('Semua ingredient harus punya nama', 400))
    }

    if (!Array.isArray(steps) || steps.length < 1) {
        return next(new CustomError('Minimal 1 step wajib diisi', 400))
    }

    const invalidStep = steps.some((s) => !s.deskripsi || s.deskripsi.trim() === '')

    if (invalidStep) {
        return next(new CustomError('Semua step harus diisi', 400))
    }

    if (waktu_masak !== undefined && waktu_masak !== null) {
        const num = Number(waktu_masak)
        if (isNaN(num) || num < 0) {
            return next(new CustomError('waktu_masak harus angka valid', 400))
        }
    }

    if (porsi !== undefined && porsi !== null) {
        const num = Number(porsi)
        if (isNaN(num) || num < 0) {
            return next(new CustomError('porsi harus angka valid', 400))
        }
    }

    next()
}
