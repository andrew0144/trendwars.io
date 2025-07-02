import { Card, Stack } from "@mantine/core";
import { InputWithButton } from "../InputWithButton/InputWithButton";
import classes from "./Chat.module.css";

function Chat() {
    return ( <Card withBorder radius="md" bg="var(--mantine-color-body)" maw={500} mx="auto" mt="xl" mah={300} className={classes.chat}>
        <Stack px={10}>
          <div>
            Foobar: "This is an example message."
          </div>
          <div>
            Foobar: "This is an example message."
          </div>
          <div>
            Foobar: "This is an example message."
          </div>
          <div>
            Foobar: "This is an example message."
          </div>
          <div>
            Foobar: "This is an example message."
          </div>
          <div>
            Foobar: "This is an example message."
          </div>
          <div>
            Foobar: "This is an example message."
          </div>
          <div>
            Foobar: "This is an example message."
          </div>
          <div>
            Foobar: "This is an example message."
          </div>
          <div>
            Foobar: "This is an example message."
          </div>
        </Stack>
        <InputWithButton mt={30} className={classes.chatInput} />
      </Card> );
}

export default Chat;