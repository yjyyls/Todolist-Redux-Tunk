import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyledDiv, StyledTodoListHeader, StyledTodoListBox } from "./styles";
import Todo from "../Todo";
import { __getTodosThunk } from "../../modules/todos";

/**
 * 컴포넌트 개요 : 메인 > TODOLIST. 할 일의 목록을 가지고 있는 컴포넌트
 * 2022.12.16 : 최초 작성
 *
 * @returns TodoList 컴포넌트
 */
function TodoList({ isActive }) {
    // const todos = useSelector((state) => state.todos);
    const todos = useSelector((state) => {
        return state.todos.todos;
    });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(__getTodosThunk());
    }, []);

    return (
        <StyledDiv>
            <StyledTodoListHeader>
                {isActive ? "해야 할 일 ⛱" : "완료한 일 ✅"}
            </StyledTodoListHeader>
            <StyledTodoListBox>
                {todos
                    ?.filter((item) => item.isDone === !isActive)
                    .map((item) => {
                        return (
                            <Todo
                                key={item.id}
                                todo={item}
                                isActive={isActive}
                            />
                        );
                    })}
            </StyledTodoListBox>
        </StyledDiv>
    );
}

export default TodoList;
