'use client'

import { useEffect, useState, useTransition } from 'react'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { TbPlus, TbUser } from 'react-icons/tb'
import dayjs from 'dayjs'
import Link from 'next/link'
import type { CompanyDetail } from '../../../types'
import getCompanyUsersAction from '@/server/actions/getCompanyUsers'
import type { CompanyUsersResponse } from '@/app/(protected-pages)/company/types'

type UsersSectionProps = {
    data: CompanyDetail
}

const { Tr, Th, Td, THead, TBody } = Table

const getRoleBadgeColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
        case 'admin':
            return 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900'
        case 'manager':
            return 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900'
        case 'staff':
            return 'bg-gray-200 dark:bg-gray-200 text-gray-900 dark:text-gray-900'
        default:
            return 'bg-gray-200 dark:bg-gray-200 text-gray-900 dark:text-gray-900'
    }
}

const getStatusBadgeColor = (isActive: boolean) => {
    return isActive
        ? 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900'
        : 'bg-gray-200 dark:bg-gray-200 text-gray-900 dark:text-gray-900'
}

const UsersSection = ({ data }: UsersSectionProps) => {
    const [page, setPage] = useState(1)
    const limit = 10
    const [isLoading, startTransition] = useTransition()
    const [usersResponse, setUsersResponse] = useState<CompanyUsersResponse>({
        data: [],
        meta: {
            total: 0,
            page: 1,
            limit,
            totalPages: 0,
        },
    })

    const totalPages = usersResponse.meta.totalPages || 0

    const canPrev = page > 1
    const canNext = totalPages > 0 ? page < totalPages : usersResponse.data.length === limit

    const fetchUsers = (nextPage: number) => {
        startTransition(async () => {
            const response = await getCompanyUsersAction({
                companyId: data.id,
                page: nextPage,
                limit,
            })
            setUsersResponse(response)
        })
    }

    useEffect(() => {
        fetchUsers(page)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.id, page])

    const users = usersResponse.data || []
    const totalUsers = usersResponse.meta.total ?? 0

    if (!isLoading && users.length === 0) {
        return (
            <Card>
                <div className="text-center py-8">
                    <TbUser className="text-6xl mx-auto mb-4 text-gray-400" />
                    <h5 className="mb-2">No Users Yet</h5>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        This company doesn&apos;t have any users assigned yet.
                    </p>
                    <Link href={`/company/details/${data.id}/users/create`}>
                        <Button variant="solid" icon={<TbPlus />}>
                            Add User
                        </Button>
                    </Link>
                </div>
            </Card>
        )
    }

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h5>Company Users</h5>
                    <p className="text-gray-600 dark:text-gray-400">
                        Total {totalUsers} users
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        disabled={!canPrev || isLoading}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Prev
                    </Button>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Page {usersResponse.meta.page}
                        {totalPages ? ` / ${totalPages}` : ''}
                    </div>
                    <Button
                        type="button"
                        disabled={!canNext || isLoading}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                    <Link href={`/company/details/${data.id}/users/create`}>
                        <Button
                            variant="solid"
                            icon={<TbPlus />}
                            loading={isLoading}
                        >
                            Add User
                        </Button>
                    </Link>
                </div>
            </div>

            <Table>
                <THead>
                    <Tr>
                        <Th>User</Th>
                        <Th>Role</Th>
                        <Th>Status</Th>
                        <Th>Joined Date</Th>
                    </Tr>
                </THead>
                <TBody>
                    {users.map((user) => (
                        <Tr key={user.id}>
                            <Td>
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        size={35}
                                        shape="circle"
                                        icon={<TbUser />}
                                        className="bg-gray-200 dark:bg-gray-700"
                                    />
                                    <div>
                                        <div className="font-bold">
                                            {user.firstName} {user.lastName}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                            </Td>
                            <Td>
                                <div>
                                    <Badge className={getRoleBadgeColor(user.role.name)}>
                                        {user.role.name.toUpperCase()}
                                    </Badge>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {user.role.description}
                                    </div>
                                </div>
                            </Td>
                            <Td>
                                <Badge
                                    className={getStatusBadgeColor(user.isActive)}
                                >
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </Td>
                            <Td>
                                {dayjs(user.createdAt).format('DD MMM YYYY')}
                            </Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </Card>
    )
}

export default UsersSection
