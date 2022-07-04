import { NextPage } from "next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button, TextInput, useFetch, useModal, useRequest } from "@nimil-jp/react-utils";

import { client } from "libs/http";
import modalState from "states/modalState";
import { useTodo } from "states/todo";

import styles from "./index.module.scss";

type Input = {
  keyword: string;
};

const Index: NextPage = () => {
  const [me, meLoading] = useFetch(client.user.me.get, {}, []);

  const [login, loginLoading] = useRequest(client.user.login.post);

  console.log("me", me, meLoading);

  useEffect(() => {
    login({ session: true, email: "a@a.a", password: "password" })
      .then((value) => {
        console.log(value);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log("loginLoading", loginLoading);

  const { showModal, closeModal } = useModal(modalState);
  const { todos, newTodo, checkTodo, removeTodo } = useTodo();

  const { register, handleSubmit } = useForm<Input>();

  const modalOpen = () =>
    showModal(
      <>
        <h3>モーダル</h3>
        <Button onClick={closeModal}>閉じる</Button>
      </>,
    );

  const onSubmit = (data: Input) => {
    newTodo(data.keyword);
  };

  return (
    <div>
      <Button onClick={modalOpen}>モーダル</Button>
      <TextInput {...register("keyword")} />
      <Button onClick={handleSubmit(onSubmit)}>追加</Button>
      {todos.map((value, i) => (
        <div key={i} className={styles.todo}>
          <div>
            {value.id} {value.title}
          </div>
          <Button onClick={() => checkTodo(value.id)}>{value.isDone ? "✅" : "⭕️"}</Button>
          <Button onClick={() => removeTodo(value.id)}>削除</Button>
        </div>
      ))}
    </div>
  );
};

export default Index;
