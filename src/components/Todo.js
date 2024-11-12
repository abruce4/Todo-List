import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";

function Todo() {
    
    const [todoList, setTodoList] = useState([]); // These are like boxes where we store different pieces of information
    const [editableId, setEditableId] = useState(null);  // Remembers which task we're editing
    const [editedTask, setEditedTask] = useState("");    // Stores the task we're changing
    const [editedStatus, setEditedStatus] = useState(""); // Stores the status we're changing
    const [newTask, setNewTask] = useState("");          // Stores a brand new task
    const [newStatus, setNewStatus] = useState("");      // Stores a brand new status
    const [newDeadline, setNewDeadline] = useState("");  // Stores when the task needs to be done
    const [editedDeadline, setEditedDeadline] = useState(""); // Stores the deadline we're changing

    // This is like a list of colored stickers we can put on our tasks
    const statusOptions = [
        { value: "Not Started", color: "secondary" },  // Gray for tasks we haven't started
        { value: "In Progress", color: "warning" },    // Yellow for tasks we're working on
        { value: "Completed", color: "success" },      // Green for finished tasks
    ];

    // When our page first opens, this part gets all our tasks from our storage box (database)
    useEffect(() => {
        axios.get('http://127.0.0.1:3001/getTodoList')  // Ask for our list of tasks
            .then(result => {
                setTodoList(result.data)  // Put the tasks in our todoList box
            })
            .catch(err => console.log(err))  // If something goes wrong, tell us about it
    }, [])

    // This is like clicking an "Edit" button on a task
    const toggleEditable = (id) => {
        // Find the task we want to edit
        const rowData = todoList.find((data) => data._id === id);
        if (rowData) {
            // If we found the task, get ready to edit it
            setEditableId(id);  // Remember which task we're editing
            setEditedTask(rowData.task);  // Put the task text in our editing box
            setEditedStatus(rowData.status);  // Remember its current status
            setEditedDeadline(rowData.deadline || "");  // Remember when it needs to be done
        } else {
            // If we can't find the task, clear all our editing boxes
            setEditableId(null);
            setEditedTask("");
            setEditedStatus("");
            setEditedDeadline("");
        }
    };

    // This is like adding a new task to our list
    const addTask = (e) => {
        e.preventDefault();  // Stop the page from refreshing
        // Make sure we filled out all the information
        if (!newTask || !newStatus || !newDeadline) {
            alert("All fields must be filled out.");  // Show a reminder if we forgot something
            return;
        }

        // Send the new task to our storage box (database)
        axios.post('http://127.0.0.1:3001/addTodoList', { task: newTask, status: newStatus, deadline: newDeadline })
            .then(res => {
                console.log(res);
                window.location.reload();  // Refresh the page to see our new task
            })
            .catch(err => console.log(err));  // If something goes wrong, tell us about it
    }

    // This saves any changes we made to a task
    const saveEditedTask = (id) => {
        // Put all our changes in one box
        const editedData = {
            task: editedTask,
            status: editedStatus,
            deadline: editedDeadline,
        };

        // Make sure we didn't leave anything blank
        if (!editedTask || !editedStatus || !editedDeadline) {
            alert("All fields must be filled out.");  // Show a reminder if we forgot something
            return;
        }

        // Save our changes to the storage box (database)
        axios.post('http://127.0.0.1:3001/updateTodoList/' + id, editedData)
            .then(result => {
                console.log(result);
                // Clear all our editing boxes
                setEditableId(null);
                setEditedTask("");
                setEditedStatus("");
                setEditedDeadline("");
                window.location.reload();  // Refresh the page to see our changes
            })
            .catch(err => console.log(err));  // If something goes wrong, tell us about it
    }

    // This is like erasing a task from our list
    const deleteTask = (id) => {
        // Tell our storage box (database) to remove the task
        axios.delete('http://127.0.0.1:3001/deleteTodoList/' + id)
            .then(result => {
                console.log(result);
                window.location.reload();  // Refresh the page to see the task is gone
            })
            .catch(err => console.log(err))  // If something goes wrong, tell us about it
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