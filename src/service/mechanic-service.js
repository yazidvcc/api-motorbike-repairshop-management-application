import prismaClient from "../application/database.js"
import ResponseError from "../error/response-error.js"
import validate from "../validation/validation.js"
import path from "path"
import { rootPath } from "../application/root-path.js"
import { v4 as uuid } from "uuid"
import { depth } from "../application/depht.js"
import { createMechanicValidation, createMechanicPhotoValidation, searchMechanicValidation, updateMechaniceValidation, idMechanicValidation } from "../validation/mechanic-validation.js"

const create = async (request) => {

    const mechanic = validate(createMechanicValidation, request)

    return prismaClient.mechanic.create({
        data: mechanic,
        select: {
            id: true,
            name: true,
            phone: true,
            address: true
        }
    })

}

const photo = async (mechanicId, request) => {

    const mechanic = validate(createMechanicPhotoValidation, {
        id: mechanicId,
        photo: request.name
    })

    const countInDatabase = await prismaClient.mechanic.count({
        where: {
            id: {
                equals: mechanic.id
            }
        }
    })

    if (countInDatabase !== 1) {
        throw new ResponseError(404, "Mechanic not found")
    }

    const fileNamed = `${mechanic.id}${uuid().toString().replace(/-/g, "")}.${request.name.split(".").pop()}`

    const storagePath = path.resolve(rootPath, "storage/mechanic", fileNamed)
    await request.mv(storagePath)

    return prismaClient.mechanic.update({
        where: {
            id: mechanic.id
        },
        data: {
            photo: fileNamed
        },
        select: {
            id: true,
            photo: true
        }
    })

}

const get = async (mechanicId) => {

    mechanicId = validate(idMechanicValidation, mechanicId)

    const mechanic = await prismaClient.mechanic.findUnique({
        where: {
            id: mechanicId
        },
        select: {
            id: true,
            name: true,
            phone: true,
            address: true
        }
    })

    if (!mechanic) {
        throw new ResponseError(404, "Mechanic not found")
    }

    return mechanic

}

const search = async (request) => {

    request = validate(searchMechanicValidation, request)

    const skip = (request.page - 1) * request.size

    let filters = [
        {
            name: {
                contains: request.name
            }
        },
        {
            phone: {
                contains: request.phone
            }
        },
        {
            address: {
                contains: request.address
            }
        }
    ]

    const mechanics = await prismaClient.mechanic.findMany({
        where: {
            AND: filters
        },
        skip: skip,
        take: request.size,
        orderBy: {
            name: "asc"
        }
    })

    const count = await prismaClient.mechanic.count({
        where: {
            AND: filters
        },
    })

    return {
        data: mechanics,
        paging: {
            page: request.page,
            total_item: count,
            total_page: Math.ceil(count / request.size)
        }
    }

}

const update = async (request) => {

    const mechanic = validate(updateMechaniceValidation, request)

    const countInDatabase = await prismaClient.mechanic.count({
        where: {
            id: {
                equals: mechanic.id
            }
        }
    })

    if (countInDatabase !== 1) {
        throw new ResponseError(404, "Mechanic not found")
    }

    return prismaClient.mechanic.update({
        where: {
            id: mechanic.id
        },
        data: mechanic,
        select: {
            id: true,
            name: true,
            phone: true,
            address: true
        }
    })
}

const remove = async (mechanicId) => {

    mechanicId = validate(idMechanicValidation, mechanicId)

    const countInDatabase = await prismaClient.mechanic.count({
        where: {
            id: {
                equals: mechanicId
            }
        }
    })

    if (countInDatabase !== 1) {
        throw new ResponseError(404, "Mechanic not found")
    }

    return prismaClient.mechanic.delete({
        where: {
            id: mechanicId
        }
    })
}

const getPhoto = async (mechanicId) => {

    mechanicId = validate(idMechanicValidation, mechanicId)

    const mechanic = await prismaClient.mechanic.findUnique({
        where: {
            id: mechanicId
        }
    })

    if (!mechanic) {
        throw new ResponseError(404, "Mechanic not found")
    }

    if (!mechanic.photo) {
        return path.resolve(rootPath, "storage/mechanic/not-found.png")
    }

    return path.resolve(rootPath, "storage/mechanic", mechanic.photo)

}

const dataRanking = async () => {

    const now = new Date()
    
    const mechanic = await prismaClient.order.groupBy({
        by: ["mechanic_id"],
        _sum: {
            total_service: true,
            total_part: true
        },
        _count: {
            id: true
        },
        orderBy: {
            _count: {
                id: "desc"
            }
        },
        where: {
            AND: [
                {
                    type: {
                        equals: "services"
                    }
                },
                {
                    date: {
                        gte: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
                        lte: now.toISOString()
                    }
                }
            ]
        }
    })

    const absen = await prismaClient.order.groupBy({
        by: ["mechanic_id","date"],
        _count: {
            id: true
        },
        orderBy: {
            mechanic_id: "asc"
        },
        where: {
            AND: [
                {
                    type: {
                        equals: "services"
                    }
                },
                {
                    date: {
                        gte: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
                        lte: now.toISOString()
                    }
                }
            ]
        }
    })

    depth(absen)

    const countAbsen = []
    let count = 1

    absen.forEach((item, index) => {
        if (index < absen.length - 1 && item.mechanic_id === absen[index + 1].mechanic_id) {
            count++
        } else {
            countAbsen.push({
                mechanic_id: item.mechanic_id,
                count: count
            })
            count = 1
        }
    })

    const mechanicIds = mechanic.map(m => m.mechanic_id);
    const mechanicsInfo = await prismaClient.mechanic.findMany({
        where: { id: { in: mechanicIds } }
    });
    const mechanicMap = new Map(mechanicsInfo.map(m => [m.id, m.name]));

    const dataRapi = mechanic.map((item) => {
        const matchingAbsen = countAbsen.find(a => a.mechanic_id === item.mechanic_id);
        return {
            mechanic_id: item.mechanic_id,
            name: mechanicMap.get(item.mechanic_id) || `Mekanik ${item.mechanic_id}`,
            count_motor: item._count.id,
            total_service: item._sum.total_service,
            total_part: item._sum.total_part,
            absen: matchingAbsen ? matchingAbsen.count : 0
        }
    })

    return dataRapi
}

const merecMethod = async () => {
    const data = await dataRanking();
    if (!data || data.length === 0) return null;

    const criteria = ['count_motor', 'total_service', 'total_part', 'absen'];
    const n = data.length; // jumlah alternatif (mekanik)
    const m = criteria.length; // jumlah kriteria

    // 1. Matriks Keputusan (X)
    const matrix = data.map(item => criteria.map(c => item[c] || 0));

    // 2. Normalisasi
    // Semua kriteria (count_motor, total_service, total_part, absen) adalah benefit criteria.
    // Rumus normalisasi MEREC untuk benefit: n_ij = min(x_j) / x_ij
    const mins = criteria.map((_, j) => {
        const colValues = matrix.map(row => row[j]);
        return Math.min(...colValues);
    });

    const epsilon = 0.0001; // Untuk menghindari log(0) atau pembagian dengan nol
    const normalizedMatrix = matrix.map(row => 
        row.map((val, j) => mins[j] / (val || epsilon))
    );

    // 3. Menghitung Overall Performance (Si)
    // Si = ln(1 + (1/m * sum |ln(nij)|))
    const Si = normalizedMatrix.map(row => {
        const sumAbsLog = row.reduce((acc, val) => acc + Math.abs(Math.log(val || epsilon)), 0);
        return Math.log(1 + (1 / m * sumAbsLog));
    });

    // 4. Menghitung Performance dengan Penghapusan Kriteria (S'ij)
    // S'ij = ln(1 + (1/m * sum_{k != j} |ln(nik)|))
    const S_prime = normalizedMatrix.map(row => {
        return criteria.map((_, j) => {
            const sumAbsLogExceptJ = row.reduce((acc, val, k) => {
                if (k === j) return acc;
                return acc + Math.abs(Math.log(val || epsilon));
            }, 0);
            return Math.log(1 + (1 / m * sumAbsLogExceptJ));
        });
    });

    // 5. Menghitung Total Efek Penghapusan (Ej)
    // Ej = sum_i |S'ij - Si|
    const Ej = criteria.map((_, j) => {
        return Si.reduce((acc, s_i, i) => acc + Math.abs(S_prime[i][j] - s_i), 0);
    });

    // 6. Menghitung Bobot Kriteria (wj)
    const sumEj = Ej.reduce((acc, val) => acc + val, 0);
    const weights = Ej.map(ej => ej / (sumEj || 1));

    return {
        criteria,
        weights: weights.map((w, i) => ({
            criterion: criteria[i],
            weight: w
        }))
    };
}

const mooraRanking = async () => {
    const rawData = await dataRanking();
    console.log("Raw Data Length:", rawData ? rawData.length : 0);
    if (!rawData || rawData.length === 0) return [];

    const merecResult = await merecMethod();
    console.log("MEREC Weights Found:", merecResult ? merecResult.weights.length : 0);
    if (!merecResult) return [];

    const criteria = merecResult.criteria; // ['count_motor', 'total_service', 'total_part', 'absen']
    const weights = merecResult.weights.map(w => w.weight);

    // 1. Matriks Keputusan (X)
    const matrix = rawData.map(item => criteria.map(c => item[c] || 0));
    const n = matrix.length; // Alternatif
    const m = criteria.length; // Kriteria

    // 2. Normalisasi (Ratio Method)
    // x*_ij = x_ij / sqrt(sum(x_ij^2))
    const sqrtSumSq = criteria.map((_, j) => {
        const sumSq = matrix.reduce((acc, row) => acc + Math.pow(row[j], 2), 0);
        return Math.sqrt(sumSq) || 1;
    });

    const normalizedMatrix = matrix.map(row => 
        row.map((val, j) => val / sqrtSumSq[j])
    );

    // 3. Menghitung Nilai Optimasi (yi)
    // yi = sum(wj * normalized_val) -> Karena semua kriteria BENEFIT
    const results = rawData.map((mechanic, i) => {
        const yi = normalizedMatrix[i].reduce((acc, val, j) => acc + (val * weights[j]), 0);
        return {
            mechanic_id: mechanic.mechanic_id,
            name: mechanic.name,
            score: yi,
            details: {
                count_motor: mechanic.count_motor,
                total_service: mechanic.total_service,
                total_part: mechanic.total_part,
                absen: mechanic.absen
            }
        };
    });

    // 4. Perankingan
    results.sort((a, b) => b.score - a.score);

    return results.map((item, index) => ({
        rank: index + 1,
        ...item
    }));
}



export default {
    create,
    photo,
    search,
    update,
    remove,
    getPhoto,
    get,
    dataRanking,
    merecMethod,
    mooraRanking
}