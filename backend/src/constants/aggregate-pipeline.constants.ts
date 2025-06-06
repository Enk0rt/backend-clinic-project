import { FilterQuery } from "mongoose";

import { IClinic, IClinicQuery } from "../interfaces/clinic.interface";
import { IDoctor, IDoctorQuery } from "../interfaces/doctor.interface";

export const aggregatePipelineConstants = {
    doctorAggregatePipeline: (
        query: IDoctorQuery,
        filter: FilterQuery<IDoctor>,
        skip: number,
        pageSize: number,
        sortDirection: 1 | -1,
    ) => [
        {
            $lookup: {
                from: "users",
                localField: "userInfo",
                foreignField: "_id",
                as: "userInfo",
            },
        },
        { $unwind: "$userInfo" },
        {
            $lookup: {
                from: "services",
                localField: "services",
                foreignField: "_id",
                as: "services",
            },
        },
        {
            $lookup: {
                from: "clinics",
                localField: "clinics",
                foreignField: "_id",
                as: "clinics",
            },
        },
        { $match: filter },
        {
            $project: {
                services: {
                    $map: {
                        input: "$services",
                        as: "service",
                        in: "$$service.name",
                    },
                },
                clinics: {
                    $map: {
                        input: "$clinics",
                        as: "clinic",
                        in: {
                            name: "$$clinic.name",
                            city: "$$clinic.city",
                            address: "$$clinic.address",
                        },
                    },
                },
                userInfo: {
                    name: "$userInfo.name",
                    surname: "$userInfo.surname",
                    age: "$userInfo.age",
                    email: "$userInfo.email",
                    phoneNumber: "$userInfo.phoneNumber",
                },
            },
        },
        {
            $facet: {
                data: [
                    { $sort: { [query.sort]: sortDirection } },
                    ...(pageSize
                        ? [{ $skip: skip }, { $limit: pageSize }]
                        : []),
                ],
                totalCount: [{ $count: "count" }],
            },
        },
    ],
    clinicAggregatePipeline: (
        query: IClinicQuery,
        filter: FilterQuery<IClinic>,
        skip: number,
        pageSize: number,
        sortDirection: 1 | -1,
    ) => [
        {
            $lookup: {
                from: "doctors",
                localField: "doctors",
                foreignField: "_id",
                as: "doctors",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "doctors.userInfo",
                foreignField: "_id",
                as: "allUsers",
            },
        },
        {
            $addFields: {
                doctors: {
                    $map: {
                        input: "$doctors",
                        as: "doctor",
                        in: {
                            _id: "$$doctor._id",
                            phoneNumber: "$$doctor.phoneNumber",
                            userInfo: {
                                $let: {
                                    vars: {
                                        matchedUser: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: "$allUsers",
                                                        as: "user",
                                                        cond: {
                                                            $eq: [
                                                                "$$user._id",
                                                                "$$doctor.userInfo",
                                                            ],
                                                        },
                                                    },
                                                },
                                                0,
                                            ],
                                        },
                                    },
                                    in: {
                                        name: "$$matchedUser.name",
                                        surname: "$$matchedUser.surname",
                                        age: "$$matchedUser.age",
                                        email: "$$matchedUser.email",
                                        phoneNumber:
                                            "$$matchedUser.phoneNumber",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        {
            $lookup: {
                from: "services",
                localField: "services",
                foreignField: "_id",
                as: "services",
            },
        },
        {
            $match: filter,
        },
        {
            $project: {
                _id: 1,
                name: 1,
                city: 1,
                address: 1,
                doctors: 1,
                services: {
                    $map: {
                        input: "$services",
                        as: "service",
                        in: {
                            _id: "$$service._id",
                            name: "$$service.name",
                        },
                    },
                },
            },
        },
        {
            $facet: {
                data: [
                    { $sort: { [query.sort]: sortDirection } },
                    ...(pageSize
                        ? [{ $skip: skip }, { $limit: pageSize }]
                        : []),
                ],
                totalCount: [{ $count: "count" }],
            },
        },
    ],
};
