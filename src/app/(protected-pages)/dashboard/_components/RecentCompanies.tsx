'use client'

import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import Avatar from '@/components/ui/Avatar'
import { TbUsers, TbLink } from 'react-icons/tb'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import type { RecentCompany } from '../types'

type RecentCompaniesProps = {
    data: RecentCompany[]
}

const { Tr, Td, TBody, THead, Th } = Table

const statusColor: Record<string, string> = {
    ACTIVE: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    TRIAL: 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900',
    INACTIVE: 'bg-gray-200 dark:bg-gray-200 text-gray-900 dark:text-gray-900',
    SUSPENDED: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const CompanyColumn = ({ row }: { row: RecentCompany }) => {
    return (
        <div className="flex items-center gap-3">
            <Avatar size={40} src={row.logo || undefined} shape="circle">
                {row.name.charAt(0)}
            </Avatar>
            <div>
                <div className="font-semibold">{row.name}</div>
                <div className="text-sm text-gray-500">{row.email}</div>
            </div>
        </div>
    )
}

const SubscriptionColumn = ({ row }: { row: RecentCompany }) => {
    if (!row.subscription) {
        return <span className="text-gray-400">No subscription</span>
    }

    const isMonthly = row.subscription.billingCycle === 'MONTHLY'
    const price = isMonthly 
        ? row.subscription.plan.finalMonthlyPrice 
        : row.subscription.plan.finalYearlyPrice

    return (
        <div>
            <div className="font-semibold">{row.subscription.plan.name}</div>
            <div className="text-sm text-emerald-600">
                Rp {price?.toLocaleString('id-ID') || '0'} / {isMonthly ? 'bulan' : 'tahun'}
            </div>
        </div>
    )
}

export default function RecentCompanies({ data }: RecentCompaniesProps) {
    const columns: ColumnDef<RecentCompany>[] = useMemo(
        () => [
            {
                header: 'Company',
                cell: ({ row }) => <CompanyColumn row={row.original} />,
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => {
                    const status = row.original.status
                    return (
                        <Tag className={statusColor[status]}>
                            <span className="capitalize">{status}</span>
                        </Tag>
                    )
                },
            },
            {
                header: 'Users',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <TbUsers className="text-lg" />
                        <span>{row.original._count.users}</span>
                    </div>
                ),
            },
            {
                header: 'Subscription',
                cell: ({ row }) => <SubscriptionColumn row={row.original} />,
            },
            {
                header: 'Website',
                cell: ({ row }) => {
                    const website = row.original.website
                    if (!website) {
                        return <span className="text-gray-400">-</span>
                    }
                    return (
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                            <TbLink />
                            <span>Visit</span>
                        </a>
                    )
                },
            },
        ],
        [],
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h4>Recent Companies</h4>
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            {data.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No companies yet
                </div>
            )}
        </Card>
    )
}
