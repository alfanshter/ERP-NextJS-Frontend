'use client'

import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { TbPlus, TbUser } from 'react-icons/tb'
import dayjs from 'dayjs'
import type { CompanyDetail } from '../../../types'

type UsersSectionProps = {
    data: CompanyDetail
}

const { Tr, Th, Td, THead, TBody } = Table

const getRoleBadgeColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
        case 'admin':
            return 'bg-red-500'
        case 'manager':
            return 'bg-blue-500'
        case 'staff':
            return 'bg-gray-500'
        default:
            return 'bg-gray-500'
    }
}

const UsersSection = ({ data }: UsersSectionProps) => {
    if (!data.users || data.users.length === 0) {
        return (
            <Card>
                <div className="text-center py-8">
                    <TbUser className="text-6xl mx-auto mb-4 text-gray-400" />
                    <h5 className="mb-2">No Users Yet</h5>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        This company doesn&apos;t have any users assigned yet.
                    </p>
                    <Button variant="solid" icon={<TbPlus />}>
                        Add User
                    </Button>
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
                        Total {data._count.users} users
                    </p>
                </div>
                <Button variant="solid" icon={<TbPlus />}>
                    Add User
                </Button>
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
                    {data.users.map((user) => (
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
                                    className={
                                        user.isActive
                                            ? 'bg-emerald-500'
                                            : 'bg-gray-500'
                                    }
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
