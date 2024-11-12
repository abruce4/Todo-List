import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";

function Todo() {
    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");

    // Add this new constant for status options
    const statusOptions = [
        { value: "Not Started", color: "secondary" },
        { value: "In Progress", color: "warning" },
        { value: "Completed", color: "success" },
    ];

    // Fetch tasks from database
    useEffect(() => {
        axios.get('http://127.0.0.1:3001/getTodoList')
            .then(result => {
                setTodoList(result.data)
            })
            .catch(err => console.log(err))
    }, [])

    // Function to toggle the editable state for a specific row
    const toggleEditable = (id) => {
        const rowData = todoList.find((data) => data._id === id);
        if (rowData) {
            setEditableId(id);
            setEditedTask(rowData.task);
            setEditedStatus(rowData.status);
            setEditedDeadline(rowData.deadline || "");
        } else {
            setEditableId(null);
            setEditedTask("");
            setEditedStatus("");
            setEditedDeadline("");
        }
    };


    // Function to add task to the database
    const addTask = (e) => {
        e.preventDefault();
        if (!newTask || !newStatus || !newDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        axios.post('http://127.0.0.1:3001/addTodoList', { task: newTask, status: newStatus, deadline: newDeadline })
            .then(res => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    // Function to save edited data to the database
    const saveEditedTask = (id) => {
        const editedData = {
            task: editedTask,
            status: editedStatus,
            deadline: editedDeadline,
        };

        // If the fields are empty
        if (!editedTask || !editedStatus || !editedDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        // Updating edited data to the database through updateById API
        axios.post('http://127.0.0.1:3001/updateTodoList/' + id, editedData)
            .then(result => {
                console.log(result);
                setEditableId(null);
                setEditedTask("");
                setEditedStatus("");
                setEditedDeadline(""); // Clear the edited deadline
                window.location.reload();
            })
            .catch(err => console.log(err));
    }


    // Delete task from database
    const deleteTask = (id) => {
        axios.delete('http://127.0.0.1:3001/deleteTodoList/' + id)
            .then(result => {
                console.log(result);
                window.location.reload();
            })
            .catch(err =>
                console.log(err)
            )
    }

    return (
        <div className="container-fluid px-4 py-5">
            <div className="row gy-4">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0"><i className="fas fa-tasks me-2"></i>Todo List</h3>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Task</th>
                                            <th>Status</th>
                                            <th>Deadline</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    {Array.isArray(todoList) ? (
                                        <tbody>
                                            {todoList.map((data) => (
                                                <tr key={data._id}>
                                                    <td>
                                                        {editableId === data._id ? (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={editedTask}
                                                                onChange={(e) => setEditedTask(e.target.value)}
                                                            />
                                                        ) : (
                                                            data.task
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editableId === data._id ? (
                                                            <select
                                                                className="form-select"
                                                                value={editedStatus}
                                                                onChange={(e) => setEditedStatus(e.target.value)}
                                                            >
                                                                {statusOptions.map(option => (
                                                                    <option key={option.value} value={option.value}>
                                                                        {option.value}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <span className={`badge bg-${statusOptions.find(opt => opt.value === data.status)?.color || 'secondary'}`}>
                                                                {data.status}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editableId === data._id ? (
                                                            <input
                                                                type="datetime-local"
                                                                className="form-control"
                                                                value={editedDeadline}
                                                                onChange={(e) => setEditedDeadline(e.target.value)}
                                                            />
                                                        ) : (
                                                            <span className="text-muted">
                                                                <i className="far fa-clock me-1"></i>
                                                                {data.deadline ? new Date(data.deadline).toLocaleString() : ''}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editableId === data._id ? (
                                                            <button className="btn btn-success btn-sm me-2" onClick={() => saveEditedTask(data._id)}>
                                                                <i className="fas fa-save me-1"></i> Save
                                                            </button>
                                                        ) : (
                                                            <button className="btn btn-outline-primary btn-sm me-2" onClick={() => toggleEditable(data._id)}>
                                                                <i className="fas fa-edit me-1"></i> Edit
                                                            </button>
                                                        )}
                                                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteTask(data._id)}>
                                                            <i className="fas fa-trash me-1"></i> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td colSpan="4" className="text-center py-4">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-success text-white">
                            <h3 className="mb-0"><i className="fas fa-plus me-2"></i>Add Task</h3>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label"><i className="fas fa-pencil-alt me-2"></i>Task</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Enter Task"
                                        onChange={(e) => setNewTask(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label"><i className="fas fa-info-circle me-2"></i>Status</label>
                                    <select
                                        className="form-select"
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select Status</option>
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label"><i className="far fa-calendar-alt me-2"></i>Deadline</label>
                                    <input
                                        className="form-control"
                                        type="datetime-local"
                                        onChange={(e) => setNewDeadline(e.target.value)}
                                    />
                                </div>
                                <button onClick={addTask} className="btn btn-success w-100">
                                    <i className="fas fa-plus-circle me-2"></i>Add Task
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Todo;