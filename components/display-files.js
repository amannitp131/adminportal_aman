import {
    IconButton,
    TableFooter,
    TablePagination,
    TableRow,
    Typography,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import { AddForm } from './Coursefiles-props/add-form';
import { EditForm } from './Coursefiles-props/edit-form';
import { ConfirmDelete } from './Coursefiles-props/confirm-delete'; // Ensure this is imported correctly
import Loading from '../components/loading';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        boxSizing: 'border-box',
    },
    paper: {
        margin: `${theme.spacing(1)}px auto`,
        padding: `${theme.spacing(1.5)}px`,
        lineHeight: 1.5,
    },
}));

const CoursesDataDisplay = () => {
    const classes = useStyles();
    const [session] = useSession();
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!session) {
                console.error('User is not logged in');
                return;
            }
    
            setIsLoading(true);
            try {
                const response = await fetch(`/api/course/byEmail?type=byEmail&email=${encodeURIComponent(session.user.email)}`);
                const data = await response.json();
                console.log('Fetched courses:', data); // Log the response
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const openAddModal = () => setAddModal(true);
    const closeAddModal = () => setAddModal(false);

    const openEditModal = (course) => {
        setCurrentCourse(course);
        setEditModal(true);
    };
    const closeEditModal = () => {
        setCurrentCourse(null);
        setEditModal(false);
    };

    const openConfirmDeleteModal = (course) => {
        setCourseToDelete(course);
        setConfirmDeleteModal(true);
    };

    const closeConfirmDeleteModal = () => {
        setCourseToDelete(null);
        setConfirmDeleteModal(false);
    };

    const deleteCourse = async (id) => {
        const response = await fetch(`/api/course/${id}`, { method: 'DELETE' });
        if (response.ok) {
            setCourses(courses.filter(course => course.id !== id));
        }
    };

    return (
        <div style={{ alignItems: 'center' }}>
            <header>
                <Typography variant="h4" style={{ margin: '15px 0' }}>
                    Course List
                </Typography>
                <Button variant="contained" color="primary" onClick={openAddModal}>
                    ADD +
                </Button>
            </header>

            {isLoading ? (
                <Loading />
            ) : (
                <Grid container spacing={2}>
                    {Array.isArray(courses) && courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course) => (
                        <Grid item xs={12} sm={6} md={4} key={course.id}>
                            <Paper className={classes.paper}>
                                <Typography variant="h6">{course.title}</Typography>
                                <Typography variant="body2">Course Code: {course.course_code}</Typography>
                                <Button onClick={() => openEditModal(course)}>Edit</Button>
                                <Button onClick={() => openConfirmDeleteModal(course)}>Delete</Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        count={courses.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableRow>
            </TableFooter>

            {/* Add Form Modal */}
            <AddForm modal={addModal} handleClose={closeAddModal} />
            {/* Edit Form Modal */}
            {currentCourse && <EditForm modal={editModal} handleClose={closeEditModal} data={currentCourse} />}
            {/* Confirm Delete Modal */}
            <ConfirmDelete
                modal={confirmDeleteModal}
                handleClose={closeConfirmDeleteModal}
                id={courseToDelete?.id}
                main_event={courseToDelete?.main_attachment}
                attachments={courseToDelete?.attachments || []}
                delArray={[]} // Pass any relevant array for deletion
            />
        </div>
    );
};

export default CoursesDataDisplay;
