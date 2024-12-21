import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { Edit } from '@material-ui/icons'
import DeleteIcon from '@material-ui/icons/Delete'
import { useSession } from 'next-auth/client'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import AddBib from './profile/addBib'
import { AddCv } from './profile/addCv'
import PdfPublication from './profile/pdfpub'
import { AddCurrent, EditCurrent } from './profile/curr_admin'
import { ConfirmDelete } from './profile/delete'
import { AddEdu, EditEdu } from './profile/education'
import { AddPast, EditPast } from './profile/past_admin'
import { Addphd, EditPhd } from './profile/phd'
import { AddProj, EditProj } from './profile/pg_ug'
import { AddPic } from './profile/profilepic'
import { AddProf, EditProf } from './profile/prof_service'
import { Addproject, Editproject } from './profile/project'
import { AddPublications } from './profile/publications'
import { AddResearch } from './profile/research'
import ShowPublications from './profile/show-publications'
import { AddSociety, EditSociety } from './profile/society'
import { AddForm, EditSubject } from './profile/subject'
import { AddWork, EditWork } from './profile/work'
import { getPdfUrl } from './profile/getPdfUrl'
import { AddSocialMediaForm } from './profile/social_media_links'

const Profile = styled.div`
    font-family: 'Source Sans Pro';
    margin-top: 3vw;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    .faculty-img-row {
        margin-top: 5vh;
        justify-content: center;
        text-align: center;
        .facmail {
            position: absolute;
            margin-top: -70px;
            margin-left: 60px;
        }
        h3 {
            color: #4e4e4e;
        }
        font-family: 'Source Sans Pro';
        .faculty-img-wrap {
            overflow: hidden;
            width: 250px;
            height: 250px;
            min-width: 250px;
            border-radius: 50%;

            img {
                width: 100%;
                height: auto;
                align-self: center;
            }
        }
    }
    .faculty-details-row {
        width: 80%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        #dir {
            line-height: 1.5;
            letter-spacing: 1px;
            padding-right: 3vw;
            padding-top: 50px;
        }
        .fac-card {
            width: 90%;
            margin-top: 3vh;
            margin-bottom: 3vh;
            background: #ffffff;
            box-shadow: 0px 0px 18px rgba(156, 156, 156, 0.38);
            border-radius: 5px;
            padding-left: 5%;
            padding-bottom: 15px;
            font-family: 'Source Sans Pro';
            list-style: disc;

            h3 {
                color: #2f2f2f;
            }
            .factable {
                overflow: hidden;
                max-width: 90%;
                overflow-x: scroll;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            .factable:-webkit-scrollbar {
                width: 0px;
                background: transparent;
            }
            table {
                min-width: 90%;
                width: 90%;
            }
        }
    }

    .cv {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.7);
        transition: opacity 500ms;
        visibility: hidden;
        opacity: 0;
    }
    .cv:target {
        visibility: visible;
        opacity: 1;
        z-index: 1;
    }

    .popup {
        margin: 70px auto;
        padding: 20px;
        background: #fff;
        border-radius: 5px;
        width: 30%;
        position: relative;
        transition: all 5s ease-in-out;
        min-height: 70vh;
        min-width: 70vw;
    }

    .popup .close {
        position: absolute;
        top: 20px;
        right: 30px;
        transition: all 200ms;
        font-size: 30px;
        font-weight: bold;
        text-decoration: none;
        color: #333;
    }
    .popup .close:hover {
        color: #06d85f;
    }
    .popup .content {
        height: 70vh;
        width: 70vw;
        overflow: hidden;
    }
`

const SubjectRow = ({ item }) => {
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const openDeleteModal = () => {
        setDeleteModal(true)
    }
    const handleCloseDeleteModal = () => {
        setDeleteModal(false)
    }

    const openEditModal = () => setEditModal(true)
    const handleCloseEditModal = () => setEditModal(false)

    return (
        <tr>
            <td>
                <p>{item.code}</p>
            </td>
            <td>
                <p>{item.name}</p>
            </td>
            <td>
                <p>{item.start}</p>
            </td>
            <td>
                <p>
                    {item.end}
                    {/* {new Date(item.end).getFullYear()} */}
                </p>
            </td>
            <td>
                <IconButton onClick={openEditModal}>
                    <Edit />
                </IconButton>
                <EditSubject
                    handleClose={handleCloseEditModal}
                    modal={editModal}
                    values={item}
                />
            </td>
            <td>
                <IconButton aria-label="delete" onClick={openDeleteModal}>
                    <DeleteIcon />
                </IconButton>
                <ConfirmDelete
                    handleClose={handleCloseDeleteModal}
                    modal={deleteModal}
                    id={item.id}
                    del={'subjects'}
                />
            </td>
        </tr>
    )
}

const MemAndSocRow = ({ item }) => {
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const openDeleteModal = () => {
        setDeleteModal(true)
    }
    const handleCloseDeleteModal = () => {
        setDeleteModal(false)
    }

    const openEditModal = () => setEditModal(true)
    const handleCloseEditModal = () => setEditModal(false)

    return (
        <tr>
            <td>
                <p>{item.membership_id}</p>
            </td>
            <td>
                <p>{item.membership_society}</p>
            </td>
            <td>
                <p>
                    {item.start}
                    {/* {new Date(item.start).getMonth() + 1} /{" "}
          {new Date(item.start).getFullYear()} */}
                </p>
            </td>
            <td>
                <p>
                    {item.end}
                    {/* {new Date(item.end).getMonth() + 1} /{" "}
          {new Date(item.end).getFullYear()} */}
                </p>
            </td>
            <td>
                <IconButton onClick={openEditModal}>
                    <Edit />
                </IconButton>
                <EditSociety
                    handleClose={handleCloseEditModal}
                    modal={editModal}
                    values={item}
                />
            </td>
            <td>
                <IconButton
                    aria-label="delete"
                    onClick={() => openDeleteModal()}
                >
                    <DeleteIcon />
                </IconButton>
                <ConfirmDelete
                    handleClose={handleCloseDeleteModal}
                    modal={deleteModal}
                    id={item.id}
                    del={'memberships'}
                />
            </td>
        </tr>
    )
}

const EducationRow = ({ item }) => {
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const openDeleteModal = () => {
        setDeleteModal(true)
    }
    const handleCloseDeleteModal = () => {
        setDeleteModal(false)
    }

    const openEditModal = () => setEditModal(true)
    const handleCloseEditModal = () => setEditModal(false)

    return (
        <tr>
            <td>
                <p>{item.certification}</p>
            </td>
            <td>
                <p>{item.institution}</p>
            </td>
            <td>
                <p>{item.passing_year}</p>
            </td>
            <td>
                <IconButton onClick={openEditModal}>
                    <Edit />
                </IconButton>
                <EditEdu
                    handleClose={handleCloseEditModal}
                    modal={editModal}
                    values={item}
                />
            </td>
            <td>
                <IconButton aria-label="delete" onClick={openDeleteModal}>
                    <DeleteIcon />
                </IconButton>
                <ConfirmDelete
                    handleClose={handleCloseDeleteModal}
                    modal={deleteModal}
                    id={item.id}
                    del={'education'}
                />
            </td>
        </tr>
    )
}

const CurrAdminRow = ({ item }) => {
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const openDeleteModal = () => {
        setDeleteModal(true)
    }
    const handleCloseDeleteModal = () => {
        setDeleteModal(false)
    }

    const openEditModal = () => setEditModal(true)
    const handleCloseEditModal = () => setEditModal(false)

    return (
        <tr>
            <td>
                <p>{item.curr_responsibility}</p>
            </td>
            <td>
                <p>
                    {item.start}
                    {/* {new Date(item.start).getMonth() + 1} /{" "}
          {new Date(item.start).getFullYear()} */}
                </p>
            </td>
            <td>
                <IconButton onClick={openEditModal}>
                    <Edit />
                </IconButton>
                <EditCurrent
                    handleClose={handleCloseEditModal}
                    modal={editModal}
                    values={item}
                />
            </td>
            <td>
                <IconButton
                    aria-label="delete"
                    onClick={() => openDeleteModal()}
                >
                    <DeleteIcon />
                </IconButton>
                <ConfirmDelete
                    handleClose={handleCloseDeleteModal}
                    modal={deleteModal}
                    id={item.id}
                    del={'current-responsibility'}
                />
            </td>
        </tr>
    )
}

const PastAdminRow = ({ item }) => {
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const openDeleteModal = () => {
        setDeleteModal(true)
    }
    const handleCloseDeleteModal = () => {
        setDeleteModal(false)
    }

    const openEditModal = () => setEditModal(true)
    const handleCloseEditModal = () => setEditModal(false)

    return (
        <tr>
            <td>
                <p>{item.past_responsibility}</p>
            </td>
            <td>
                <p>
                    {item.start}
                    {/* {new Date(item.start).getMonth() + 1} /{" "}
          {new Date(item.start).getFullYear()} */}
                </p>
            </td>
            <td>
                <p>
                    {item.end}
                    {/* {new Date(item.end).getMonth() + 1} /{" "}
          {new Date(item.end).getFullYear()} */}
                </p>
            </td>
            <td>
                <IconButton onClick={openEditModal}>
                    <Edit />
                </IconButton>
                <EditPast
                    handleClose={handleCloseEditModal}
                    modal={editModal}
                    values={item}
                />
            </td>
            <td>
                <IconButton
                    aria-label="delete"
                    onClick={() => openDeleteModal()}
                >
                    <DeleteIcon />
                </IconButton>
                <ConfirmDelete
                    handleClose={handleCloseDeleteModal}
                    modal={deleteModal}
                    id={item.id}
                    del={'past-responsibility'}
                />
            </td>
        </tr>
    )
}

const WorkExpRow = ({ item }) => {
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const openDeleteModal = () => {
        setDeleteModal(true)
    }
    const handleCloseDeleteModal = () => {
        setDeleteModal(false)
    }

    const openEditModal = () => setEditModal(true)
    const handleCloseEditModal = () => setEditModal(false)

    return (
        <tr>
            <td>
                <p>{item.work_experiences}</p>
            </td>
            <td>
                <p>{item.institute}</p>
            </td>
            <td>
                <p>
                    {item.start}
                    {/* {new Date(item.start).getMonth() + 1} /{" "}
          {new Date(item.start).getFullYear()} */}
                </p>
            </td>
            <td>
                <p>
                    {item.end}
                    {/* {new Date(item.end).getMonth() + 1} /{" "}
          {new Date(item.end).getFullYear()} */}
                </p>
            </td>
            <td>
                <IconButton onClick={openEditModal}>
                    <Edit />
                </IconButton>
                <EditWork
                    handleClose={handleCloseEditModal}
                    modal={editModal}
                    values={item}
                />
            </td>
            <td>
                <IconButton
                    aria-label="delete"
                    onClick={() => openDeleteModal()}
                >
                    <DeleteIcon />
                </IconButton>
                <ConfirmDelete
                    handleClose={handleCloseDeleteModal}
                    modal={deleteModal}
                    id={item.id}
                    del={'workexperience'}
                />
            </td>
        </tr>
    )
}

const ProServiceRow = ({ item }) => {
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const openDeleteModal = () => {
        setDeleteModal(true)
    }
    const handleCloseDeleteModal = () => {
        setDeleteModal(false)
    }

    const openEditModal = () => setEditModal(true)
    const handleCloseEditModal = () => setEditModal(false)

    return (
        <p>
            {item.services}

            <IconButton onClick={openEditModal}>
                <Edit />
            </IconButton>
            <EditProf
                handleClose={handleCloseEditModal}
                modal={editModal}
                values={item}
            />

            <IconButton aria-label="delete" onClick={() => openDeleteModal()}>
                <DeleteIcon />
            </IconButton>
            <ConfirmDelete
                handleClose={handleCloseDeleteModal}
                modal={deleteModal}
                id={item.id}
                del={'professionalservice'}
            />
        </p>
    )
}

const ProjectRow = ({ item }) => {
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const openDeleteModal = () => {
        setDeleteModal(true)
    }
    const handleCloseDeleteModal = () => {
        setDeleteModal(false)
    }

    const openEditModal = () => setEditModal(true)
    const handleCloseEditModal = () => setEditModal(false)

    return (
        <tr>
            <td>
                <p>{item.project}</p>
            </td>
            <td>
                <p>{item.sponsor}</p>
            </td>
            <td>
                <p>{item.amount}</p>
            </td>
            <td>
                <p>
                    {item.start}
                    {/* {new Date(item.start).getMonth() + 1} /{" "}
          {new Date(item.start).getFullYear()} */}
                </p>
            </td>
            <td>
                <p>
                    {item.end}
                    {/* {new Date(item.end).getMonth() + 1} /{" "}
          {new Date(item.end).getFullYear()} */}
                </p>
            </td>
            <td>
                <IconButton onClick={openEditModal}>
                    <Edit />
                </IconButton>
                <Editproject
                    handleClose={handleCloseEditModal}
                    modal={editModal}
                    values={item}
                />
            </td>
            <td>
                <IconButton
                    aria-label="delete"
                    onClick={() => openDeleteModal()}
                >
                    <DeleteIcon />
                </IconButton>
                <ConfirmDelete
                    handleClose={handleCloseDeleteModal}
                    modal={deleteModal}
                    id={item.id}
                    del={'project'}
                />
            </td>
        </tr>
    )
}

const PhdCandidRow = ({ item, index }) => {
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const openDeleteModal = () => {
        setDeleteModal(true)
    }
    const handleCloseDeleteModal = () => {
        setDeleteModal(false)
    }

    const openEditModal = () => setEditModal(true)
    const handleCloseEditModal = () => setEditModal(false)
    return (
        <tr>
            <td>
                <p>{index + 1}</p>
            </td>
            <td>
                <p>{item.phd_student_name}</p>
            </td>
            <td>
                <p>{item.thesis_topic}</p>
            </td>
            <td>
                <p>{item.start_year}</p>
            </td>
            <td>
                <p>{item.completion_year}</p>
            </td>
            <td>
                <IconButton onClick={openEditModal}>
                    <Edit />
                </IconButton>
                <EditPhd
                    handleClose={handleCloseEditModal}
                    modal={editModal}
                    values={item}
                />
            </td>
            <td>
                {' '}
                <IconButton
                    aria-label="delete"
                    onClick={() => openDeleteModal()}
                >
                    <DeleteIcon />
                </IconButton>
                <ConfirmDelete
                    handleClose={handleCloseDeleteModal}
                    modal={deleteModal}
                    id={item.id}
                    del={'phdcandidates'}
                />
            </td>
        </tr>
    )
}

const Pg_UgProjRow = ({ item, index }) => {
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const openDeleteModal = () => {
        setDeleteModal(true)
    }
    const handleCloseDeleteModal = () => {
        setDeleteModal(false)
    }

    const openEditModal = () => setEditModal(true)
    const handleCloseEditModal = () => setEditModal(false)
    return (
        <tr>
            <td>
                <p>{index + 1}</p>
            </td>
            <td>
                <p>{item.student_name}</p>
            </td>
            <td>
                <p>{item.student_program}</p>
            </td>
            <td>
                <p>{item.project_topic}</p>
            </td>
            <td>
                <p>{item.start_year}</p>
            </td>
            <td>
                <p>{item.completion_year}</p>
            </td>
            <td>
                <IconButton onClick={openEditModal}>
                    <Edit />
                </IconButton>
                <EditProj
                    handleClose={handleCloseEditModal}
                    modal={editModal}
                    values={item}
                />
            </td>
            <td>
                {' '}
                <IconButton
                    aria-label="delete"
                    onClick={() => openDeleteModal()}
                >
                    <DeleteIcon />
                </IconButton>
                <ConfirmDelete
                    handleClose={handleCloseDeleteModal}
                    modal={deleteModal}
                    id={item.id}
                    del={'pg_ug_projects'}
                />
            </td>
        </tr>
    )
}

export default function Profilepage(props) {
    const [detail, setDetails] = useState(props.details)
    const [social_media_links, setSocial_media_links] = useState({})
    const [publications, setPublications] = useState(
        props.details.publications
            ? JSON.parse(props.details.publications[0].publications)
                ? JSON.parse(props.details.publications[0].publications)
                : []
            : []
    )
    console.log(props.details)

    // To update state after refreshing data
    useEffect(() => {
        setDetails(props.details)
        setSocial_media_links({
            Linkedin: detail.profile['linkedin'],
            'Google Scholar': detail.profile['google_scholar'],
            'Personal Webpage': detail.profile['personal_webpage'],
            Scopus: detail.profile['scopus'],
            Vidwan: detail.profile['vidwan'],
            Orcid: detail.profile['orcid'],
        })
        setPublications(
            props.details.publications
                ? JSON.parse(props.details.publications[0].publications)
                    ? JSON.parse(props.details.publications[0].publications)
                    : []
                : []
        )
    }, [props.details])

    const [session, loading] = useSession()
    const [addSocialMediaModal, setAddSocialMediaModal] = useState(false)
    const addSocialMediaModalOpen = () => {
        setAddSocialMediaModal(true)
    }
    const handleCloseSocialMediaAddModal = () => {
        setAddSocialMediaModal(false)
    }

    const [addModal, setAddModal] = useState(false)
    const addModalOpen = () => {
        setAddModal(true)
    }
    const handleCloseAddModal = () => {
        setAddModal(false)
    }

    const [addModal1, setAddModal1] = useState(false)
    const addModalOpen1 = () => {
        setAddModal1(true)
    }
    const handleCloseAddModal1 = () => {
        setAddModal1(false)
    }

    const [addModal2, setAddModal2] = useState(false)
    const addModalOpen2 = () => {
        setAddModal2(true)
    }
    const handleCloseAddModal2 = () => {
        setAddModal2(false)
    }

    const [addModal3, setAddModal3] = useState(false)
    const addModalOpen3 = () => {
        setAddModal3(true)
    }
    const handleCloseAddModal3 = () => {
        setAddModal3(false)
    }

    const [addModal4, setAddModal4] = useState(false)
    const addModalOpen4 = () => {
        setAddModal4(true)
    }
    const handleCloseAddModal4 = () => {
        setAddModal4(false)
    }

    const [addModal5, setAddModal5] = useState(false)
    const addModalOpen5 = () => {
        setAddModal5(true)
    }
    const handleCloseAddModal5 = () => {
        setAddModal5(false)
    }

    const [addModal6, setAddModal6] = useState(false)
    const addModalOpen6 = () => {
        setAddModal6(true)
    }
    const handleCloseAddModal6 = () => {
        setAddModal6(false)
    }

    const [addModal7, setAddModal7] = useState(false)
    const addModalOpen7 = () => {
        setAddModal7(true)
    }
    const handleCloseAddModal7 = () => {
        setAddModal7(false)
    }

    const [addModal8, setAddModal8] = useState(false)
    const addModalOpen8 = () => {
        setAddModal8(true)
    }
    const handleCloseAddModal8 = () => {
        setAddModal8(false)
    }

    const [addModal9, setAddModal9] = useState(false)
    const addModalOpen9 = () => {
        setAddModal9(true)
    }
    const handleCloseAddModal9 = () => {
        setAddModal9(false)
    }

    const [addModal10, setAddModal10] = useState(false)
    const addModalOpen10 = () => {
        setAddModal10(true)
    }
    const handleCloseAddModal10 = () => {
        setAddModal10(false)
    }

    const [addModal11, setAddModal11] = useState(false)
    const addModalOpen11 = () => {
        setAddModal11(true)
    }
    const handleCloseAddModal11 = () => {
        setAddModal11(false)
    }

    const [addModalp, setAddModalp] = useState(false)
    const addModalOpenp = () => {
        setAddModalp(true)
    }
    const handleCloseAddModalp = () => {
        setAddModalp(false)
    }

    const [addCvModalp, setAddCvModalp] = useState(false)
    const addCvModalOpenp = () => {
        setAddCvModalp(true)
    }
    const handleCloseAddCvModalp = () => {
        setAddCvModalp(false)
    }

    return (
        <>
            {session && (
                <Profile>
                    <div className="faculty-img-row">
                        <div className="faculty-img-wrap">
                            <img
                                src={
                                        detail && detail.profile && detail.profile.image
                                            ? detail.profile.image
                                            : '/faculty.png'
                                }
                                alt="faculty"
                            />
                        </div>
                        <a
                            href={`mailto:${detail?.profile?.email || 'default@example.com'}`}
                            target="blank"
                        >
                            {/* <img src={mail} className="img-fluid facmail" /> */}
                        </a>
                        <h2>{detail.profile.name}</h2>
                        <h3>{detail.profile.designation}</h3>

                        <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addModalOpenp()}
                                style={{}}
                            >
                                Upload Photo
                            </Button>
                            <AddPic
                                handleClose={handleCloseAddModalp}
                                modal={addModalp}
                            />
                            <br />
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addCvModalOpenp()}
                                style={{}}
                            >
                                {detail.profile.cv ? 'Update CV' : 'Upload CV'}
                            </Button>
                            <AddCv
                                handleClose={handleCloseAddCvModalp}
                                modal={addCvModalp}
                            />
                            <br />
                            {detail.profile.cv && (
                                <div>
                                    <a href="#cv">
                                        <Button
                                            color="primary"
                                            variant="contained"
                                        >
                                            View CV
                                        </Button>
                                    </a>

                                    <div id="cv" className="cv">
                                        <div className="popup">
                                            <a href="#" className="close">
                                                &times;
                                            </a>
                                            <div className="content">
                                                <iframe
                                                    src={getPdfUrl(
                                                        detail.profile.cv
                                                    )}
                                                    width="100%"
                                                    height="100%"
                                                ></iframe>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="faculty-details-row">
                        <h1>Profile</h1>
                        <div
                            className="fac-card"
                            data-aos="fade-up"
                            style={{ position: `relative` }}
                        >
                            {detail.profile.research_interest && (
                                <>
                                    <h3>Research Interest:-</h3>
                                    <p>{detail.profile.research_interest}</p>
                                </>
                            )}
                            <h3>Email:-</h3>
                            <p>{detail.profile.email}</p>
                            {detail.profile.ext_no && (
                                <>
                                    <h3>Phone:-</h3>
                                    <p>{detail.profile.ext_no}</p>
                                </>
                            )}
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addModalOpen9()}
                                style={{
                                    position: `absolute`,
                                    top: `5px`,
                                    right: `5px`,
                                }}
                            >
                                Edit
                            </Button>
                            <AddResearch
                                handleClose={handleCloseAddModal9}
                                modal={addModal9}
                                detail={detail.profile}
                            />
                        </div>

                        {/* <div
              className="fac-card"
              data-aos="fade-up"
              style={{ position: `relative` }}
            >
              <h3>Subjects</h3>
              <Button
                color="primary"
                variant="contained"
                onClick={() => addModalOpen()}
                style={{ position: `absolute`, top: `5px`, right: `5px` }}
              >
                Add
              </Button>
              <AddForm handleClose={handleCloseAddModal} modal={addModal} />

              {detail.subjects_teaching &&
                detail.subjects_teaching.map((item) => {
                  return (
                    <p>
                      {item.subject}
                      <IconButton
                        aria-label="delete"
                        onClick={() => addModalOpend()}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <ConfirmDelete
                        handleClose={handleCloseAddModald}
                        modal={addModald}
                        id={item.id}
                        del={"subjects"}
                      />
                    </p>
                  );
                })}
            </div> */}

                        <div
                            className="fac-card"
                            data-aos="fade-up"
                            style={{ position: `relative` }}
                        >
                            <h3>Social Media Links</h3>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addSocialMediaModalOpen()}
                                style={{
                                    position: `absolute`,
                                    top: `5px`,
                                    right: `5px`,
                                }}
                            >
                                Edit
                            </Button>
                            <AddSocialMediaForm
                                handleClose={handleCloseSocialMediaAddModal}
                                modal={addSocialMediaModal}
                                links={social_media_links}
                            />

                            <div className="factable">
                                <table>
                                    <tr>
                                        <td>
                                            <h4>Website</h4>
                                        </td>
                                        <td>
                                            <h4>Profile Link</h4>
                                        </td>
                                        <td></td>
                                    </tr>
                                    {social_media_links &&
                                        Object.keys(social_media_links).map(
                                            (key) =>
                                                social_media_links[key] ? (
                                                    <>
                                                        <tr>
                                                            <td>
                                                                <p>{key}</p>
                                                            </td>
                                                            <td>
                                                                <p>
                                                                    {
                                                                        social_media_links[
                                                                            key
                                                                        ]
                                                                    }
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </>
                                                ) : null
                                        )}
                                </table>
                            </div>
                        </div>

                        <div
                            className="fac-card"
                            data-aos="fade-up"
                            style={{ position: `relative` }}
                        >
                            <h3>Subjects</h3>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addModalOpen()}
                                style={{
                                    position: `absolute`,
                                    top: `5px`,
                                    right: `5px`,
                                }}
                            >
                                Add
                            </Button>
                            <AddForm
                                handleClose={handleCloseAddModal}
                                modal={addModal}
                            />

                            <div className="factable">
                                <table>
                                    <tr>
                                        <td>
                                            <h4>Subject Code</h4>
                                        </td>
                                        <td>
                                            <h4>Subject Name</h4>
                                        </td>
                                        <td>
                                            <h4>Session</h4>
                                        </td>
                                        <td>
                                            <h4>Year</h4>
                                        </td>
                                        <td></td>
                                    </tr>
                                    {detail.subjects_teaching &&
                                        detail.subjects_teaching.map((item) => (
                                            <SubjectRow item={item} />
                                        ))}
                                </table>
                            </div>
                        </div>

                        <div
                            className="fac-card"
                            data-aos="fade-up"
                            style={{ position: `relative` }}
                        >
                            <h3>Memberships & Society</h3>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addModalOpen1()}
                                style={{
                                    position: `absolute`,
                                    top: `5px`,
                                    right: `5px`,
                                }}
                            >
                                Add
                            </Button>
                            <AddSociety
                                handleClose={handleCloseAddModal1}
                                modal={addModal1}
                            />
                            <div className="factable">
                                <table>
                                    <tr>
                                        <td>
                                            <h4>Membership Id</h4>
                                        </td>
                                        <td>
                                            <h4>Membership Society</h4>
                                        </td>
                                        <td>
                                            <h4>Start-Date</h4>
                                        </td>
                                        <td>
                                            <h4>End-Date</h4>
                                        </td>
                                    </tr>
                                    {detail.memberships &&
                                        detail.memberships.map((item) => (
                                            <MemAndSocRow item={item} />
                                        ))}
                                </table>
                            </div>
                        </div>

                        <div
                            className="fac-card"
                            data-aos="fade-up"
                            style={{ position: `relative` }}
                        >
                            <h3>Educational Qualification</h3>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addModalOpen3()}
                                style={{
                                    position: `absolute`,
                                    top: `5px`,
                                    right: `5px`,
                                }}
                            >
                                Add
                            </Button>
                            <AddEdu
                                handleClose={handleCloseAddModal3}
                                modal={addModal3}
                            />
                            <div className="factable">
                                <table>
                                    <tr>
                                        <td>
                                            <h4>Certification</h4>
                                        </td>
                                        <td>
                                            <h4>Institute Name</h4>
                                        </td>
                                        <td>
                                            <h4>Passing Year</h4>
                                        </td>
                                    </tr>
                                    {detail.education &&
                                        detail.education.map((item) => (
                                            <EducationRow item={item} />
                                        ))}
                                </table>
                            </div>
                        </div>

                        <div
                            className="fac-card"
                            data-aos="fade-up"
                            style={{ position: `relative` }}
                        >
                            <h3>Current Administrative Responsibility</h3>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addModalOpen4()}
                                style={{
                                    position: `absolute`,
                                    top: `5px`,
                                    right: `5px`,
                                }}
                            >
                                Add
                            </Button>
                            <AddCurrent
                                handleClose={handleCloseAddModal4}
                                modal={addModal4}
                            />
                            <div className="factable">
                                <table>
                                    <tr>
                                        <td>
                                            <h4>Post</h4>
                                        </td>
                                        <td>
                                            <h4>Start-Date</h4>
                                        </td>
                                    </tr>
                                    {detail.curr_admin_responsibility &&
                                        detail.curr_admin_responsibility.map(
                                            (item) => (
                                                <CurrAdminRow item={item} />
                                            )
                                        )}
                                </table>
                            </div>
                        </div>

                        {/* <div
              className="fac-card"
              data-aos="fade-up"
              style={{ position: `relative` }}
            >
              <h3>Past Administrative Responsibility</h3>
              <Button
                color="primary"
                variant="contained"
                onClick={() => addModalOpen5()}
                style={{ position: `absolute`, top: `5px`, right: `5px` }}
              >
                Add
              </Button>
              <AddPast handleClose={handleCloseAddModal5} modal={addModal5} />
              {detail.past_admin_responsibility &&
                detail.past_admin_responsibility.map((item) => {
                  return (
                    <p>
                      {item.past_responsibility}{" "}
                      <IconButton
                        aria-label="delete"
                        onClick={() => addModalOpen5d()}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <ConfirmDelete
                        handleClose={handleCloseAddModal5d}
                        modal={addModal5d}
                        id={item.id}
                        del={"past-responsibility"}
                      />
                    </p>
                  );
                })}
            </div> */}

                        <div
                            className="fac-card"
                            data-aos="fade-up"
                            style={{ position: `relative` }}
                        >
                            <h3>Past Administrative Responsibility</h3>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addModalOpen5()}
                                style={{
                                    position: `absolute`,
                                    top: `5px`,
                                    right: `5px`,
                                }}
                            >
                                Add
                            </Button>
                            <AddPast
                                handleClose={handleCloseAddModal5}
                                modal={addModal5}
                            />
                            <div className="factable">
                                <table>
                                    <tr>
                                        <td>
                                            <h4>Post</h4>
                                        </td>
                                        <td>
                                            <h4>Start-Date</h4>
                                        </td>
                                        <td>
                                            <h4>End-Date</h4>
                                        </td>
                                    </tr>
                                    {detail.past_admin_responsibility &&
                                        detail.past_admin_responsibility.map(
                                            (item) => (
                                                <PastAdminRow item={item} />
                                            )
                                        )}
                                </table>
                            </div>
                        </div>

                        {/* <div
              className="fac-card"
              data-aos="fade-up"
              style={{ position: `relative` }}
            >
              <h3>Work Experiences</h3>
              <Button
                color="primary"
                variant="contained"
                onClick={() => addModalOpen6()}
                style={{ position: `absolute`, top: `5px`, right: `5px` }}
              >
                Add
              </Button>
              <AddWork handleClose={handleCloseAddModal6} modal={addModal6} />
              {detail.work_experience &&
                detail.work_experience.map((item) => {
                  return (
                    <p>
                      {item.work_experiences}
                      <IconButton
                        aria-label="delete"
                        onClick={() => addModalOpen6d()}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <ConfirmDelete
                        handleClose={handleCloseAddModal6d}
                        modal={addModal6d}
                        id={item.id}
                        del={"workexperience"}
                      />
                    </p>
                  );
                })}
            </div> */}

                        <div
                            className="fac-card"
                            data-aos="fade-up"
                            style={{ position: `relative` }}
                        >
                            <h3>Work Experiences</h3>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addModalOpen6()}
                                style={{
                                    position: `absolute`,
                                    top: `5px`,
                                    right: `5px`,
                                }}
                            >
                                Add
                            </Button>
                            <AddWork
                                handleClose={handleCloseAddModal6}
                                modal={addModal6}
                            />
                            <div className="factable">
                                <table>
                                    <tr>
                                        <td>
                                            <h4>Designation</h4>
                                        </td>
                                        <td>
                                            <h4>Institute/Company</h4>
                                        </td>
                                        <td>
                                            <h4>Start-Date</h4>
                                        </td>
                                        <td>
                                            <h4>End-Date</h4>
                                        </td>
                                    </tr>
                                    {detail.work_experience &&
                                        detail.work_experience.map((item) => (
                                            <WorkExpRow item={item} />
                                        ))}
                                </table>
                            </div>
                        </div>

                        <div
                            className="fac-card"
                            data-aos="fade-up"
                            style={{ position: `relative` }}
                        >
                            <h3>Professional Services</h3>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addModalOpen2()}
                                style={{
                                    position: `absolute`,
                                    top: `5px`,
                                    right: `5px`,
                                }}
                            >
                                Add
                            </Button>
                            <AddProf
                                handleClose={handleCloseAddModal2}
                                modal={addModal2}
                            />
                            {detail.professional_service &&
                                detail.professional_service.map((item) => (
                                    <ProServiceRow item={item} />
                                ))}
                        </div>

                        {/* <div
              className="fac-card"
              data-aos="fade-up"
              style={{ position: `relative` }}
            >
              <h3>Projects</h3>
              <Button
                color="primary"
                variant="contained"
                onClick={() => addModalOpen7()}
                style={{ position: `absolute`, top: `5px`, right: `5px` }}
              >
                Add
              </Button>
              <Addproject
                handleClose={handleCloseAddModal7}
                modal={addModal7}
              />
              {detail.project &&
                detail.project.map((item) => {
                  return (
                    <p>
                      {item.project}{" "}
                      <IconButton
                        aria-label="delete"
                        onClick={() => addModalOpen7d()}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <ConfirmDelete
                        handleClose={handleCloseAddModal7d}
                        modal={addModal7d}
                        id={item.id}
                        del={"project"}
                      />
                    </p>
                  );
                })}
            </div> */}
                        <div
                            className="fac-card"
                            data-aos="fade-up"
                            style={{ position: `relative` }}
                        >
                            <h3>Projects</h3>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addModalOpen7()}
                                style={{
                                    position: `absolute`,
                                    top: `5px`,
                                    right: `5px`,
                                }}
                            >
                                Add
                            </Button>
                            <Addproject
                                handleClose={handleCloseAddModal7}
                                modal={addModal7}
                            />

                            <div className="factable">
                                <table>
                                    <tr>
                                        <td>
                                            <h4>Title</h4>
                                        </td>
                                        <td>
                                            <h4>Sponsoring Agency</h4>
                                        </td>
                                        <td>
                                            <h4>Amount</h4>
                                        </td>
                                        <td>
                                            <h4>Start Time</h4>
                                        </td>
                                        <td>
                                            <h4>End Time</h4>
                                        </td>
                                    </tr>
                                    {detail.project &&
                                        detail.project.map((item) => (
                                            <ProjectRow item={item} />
                                        ))}
                                </table>
                            </div>
                        </div>

                        <div
                            className="fac-card"
                            data-aos="fade-up"
                            style={{ position: `relative` }}
                        >
                            <h3>Publications</h3>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addModalOpen10()}
                                style={{
                                    position: `absolute`,
                                    top: `5px`,
                                    right: `5px`,
                                }}
                            >
                                Add
                            </Button>
                            <AddBib published={publications} />
                            <PdfPublication
                                pdf={
                                    detail.publications?.length
                                        ? detail.publications[0]?.pub_pdf
                                        : ''
                                }
                            />
                            <AddPublications
                                published={publications}
                                handleClose={handleCloseAddModal10}
                                modal={addModal10}
                            />
                            {publications?.length && (
                                <ShowPublications
                                    publications={publications}
                                    setPublications={setPublications}
                                />
                            )}
                        </div>
                        <div
                            className="fac-card"
                            data-aos="fade-up"
                            style={{ position: `relative` }}
                        >
                            <h3>Phd Candidates</h3>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addModalOpen8()}
                                style={{
                                    position: `absolute`,
                                    top: `5px`,
                                    right: `5px`,
                                }}
                            >
                                Add
                            </Button>
                            <Addphd
                                handleClose={handleCloseAddModal8}
                                modal={addModal8}
                            />

                            <div className="factable">
                                <table>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <h4>Student Name</h4>
                                        </td>
                                        <td>
                                            <h4>Thesis Topic</h4>
                                        </td>
                                        <td>
                                            <h4>Start Year</h4>
                                        </td>
                                        <td>
                                            <h4>Completion Year</h4>
                                        </td>
                                    </tr>
                                    {detail.phd_candidates &&
                                        detail.phd_candidates.map(
                                            (item, index) => (
                                                <PhdCandidRow
                                                    item={item}
                                                    index={index}
                                                />
                                            )
                                        )}
                                </table>
                            </div>
                        </div>

                        <div
                            className="fac-card"
                            data-aos="fade-up"
                            style={{ position: `relative` }}
                        >
                            <h3>PG/UG Projects</h3>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => addModalOpen11()}
                                style={{
                                    position: `absolute`,
                                    top: `5px`,
                                    right: `5px`,
                                }}
                            >
                                Add
                            </Button>
                            <AddProj
                                handleClose={handleCloseAddModal11}
                                modal={addModal11}
                            />

                            <div className="factable">
                                <table>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <h4>Student Name</h4>
                                        </td>
                                        <td>
                                            <h4>Student Program</h4>
                                        </td>
                                        <td>
                                            <h4>Project Topic</h4>
                                        </td>
                                        <td>
                                            <h4>Start Year</h4>
                                        </td>
                                        <td>
                                            <h4>Completion Year</h4>
                                        </td>
                                    </tr>
                                    {detail.pg_ug_projects &&
                                        detail.pg_ug_projects.map(
                                            (item, index) => (
                                                <Pg_UgProjRow
                                                    item={item}
                                                    index={index}
                                                />
                                            )
                                        )}
                                </table>
                            </div>
                        </div>
                    </div>
                </Profile>
            )}
        </>
    )
}
