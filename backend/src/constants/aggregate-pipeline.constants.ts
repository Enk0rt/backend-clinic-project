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
            $match: filter,
        },
        {
            $lookup: {
                from: "doctors",
                localField: "doctors",
                foreignField: "_id",
                as: "doctors",
            },
        },
        {
            $unwind: "$doctors",
        },
        {
            $lookup: {
                from: "users",
                localField: "doctors.userInfo",
                foreignField: "_id",
                as: "doctors.userInfo",
            },
        },
        {
            $unwind: "$doctors.userInfo",
        },
        {
            $group: {
                _id: "$_id",
                name: { $first: "$name" },
                city: { $first: "$city" },
                address: { $first: "$address" },
                services: { $first: "$services" },
                doctors: {
                    $push: {
                        _id: "$doctors._id",
                        userInfo: {
                            name: "$doctors.userInfo.name",
                            surname: "$doctors.userInfo.surname",
                            age: "$doctors.userInfo.age",
                            email: "$doctors.userInfo.email",
                            phoneNumber: "$doctors.phoneNumber",
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
