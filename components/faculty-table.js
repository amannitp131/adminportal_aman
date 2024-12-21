import { AddFaculty } from '@/components/faculty-management-props/addfaculty'
import { EditFaculty } from '@/components/faculty-management-props/editfaculty'
import {
    Button,
    IconButton,
    TableFooter,
    TablePagination,
    Typography,
    TextField,
} from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Edit, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import LastPageIcon from '@material-ui/icons/LastPage'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}))

function TablePaginationActions(props) {
    const classes = useStyles1()
    const theme = useTheme()
    const { count, page, rowsPerPage, onChangePage } = props

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0)
    }

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1)
    }

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1)
    }

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? (
                    <LastPageIcon />
                ) : (
                    <FirstPageIcon />
                )}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? (
                    <FirstPageIcon />
                ) : (
                    <LastPageIcon />
                )}
            </IconButton>
        </div>
    )
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
}

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow)

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
})

const roles = [null, 'Super Admin', 'Admin', 'Faculty', 'Section Admin']

const FacultyTableRow = ({ row }) => {
    const [editModal, setEditModal] = useState(false)

    const editModalOpen = () => {
        setEditModal(true)
    }

    const handleCloseEditModal = () => {
        setEditModal(false)
    }

    return (
        <React.Fragment key={row.id}>
            <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                    {row.name}
                </StyledTableCell>
                <StyledTableCell align="right">{row.email}</StyledTableCell>
                <StyledTableCell align="right">
                    {row.designation}
                </StyledTableCell>
                <StyledTableCell align="right">
                    {row.department}
                </StyledTableCell>
                <StyledTableCell align="right">
                    {roles[row.role]}
                </StyledTableCell>
                <StyledTableCell align="right">
                    {row.administration || 'null'}
                </StyledTableCell>
                <StyledTableCell align="right">{row.ext_no}</StyledTableCell>
                <StyledTableCell
                    align="right"
                    onClick={editModalOpen}
                    style={{ cursor: `pointer` }}
                >
                    <Edit /> <span>Edit</span>
                </StyledTableCell>
            </StyledTableRow>
            <EditFaculty
                data={row}
                handleClose={handleCloseEditModal}
                modal={editModal}
            />
        </React.Fragment>
    )
}

export const FacultyTable = (props) => {
    const [rows, setRows] = useState(props.rows)
    const totalRow = [...rows]

    const classes = useStyles()
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(15)

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleSearch = (e) => {
        if (e.target.value == '') {
            setRows(props.rows)
            return
        }
        const filteredData = props.rows.filter(
            (element) =>
                element.name
                    .toLowerCase()
                    .indexOf(e.target.value.trim().toLowerCase()) != -1
        )
        setRows(filteredData)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // const roles = [null, "Admin", "HOD", "Faculty"];

    const [addModal, setAddModal] = useState(false)
    const addModalOpen = () => {
        setAddModal(true)
    }
    const handleCloseAddModal = () => {
        setAddModal(false)
    }

    return (
        <>
            <div>
                <header
                    style={{ display: `flex`, justifyContent: `space-between` }}
                >
                    <Typography variant="h3" style={{ margin: '15px 0' }}>
                        Faculty Details
                    </Typography>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            id="outlined-basic"
                            label="Search by email"
                            variant="outlined"
                            size="small"
                            style={{ marginRight: '10px' }}
                            onChange={(e) => handleSearch(e)}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={addModalOpen}
                        >
                            ADD +
                        </Button>
                    </div>
                </header>

                <AddFaculty
                    handleClose={handleCloseAddModal}
                    modal={addModal}
                />
            </div>

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="right">
                                Email
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Designation
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Department
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Role
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Administration
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Ext no.
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Modify
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? rows.slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                              )
                            : rows
                        ).map((row) => {
                            return <FacultyTableRow row={row} />
                        })}

                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[15, 25, 50, 100]}
                                colSpan={7}
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    )
}
