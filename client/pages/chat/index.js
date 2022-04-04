import dynamic from 'next/dynamic'
import Container from 'components/container'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useDebouncedCallback} from 'use-debounce'

const ChatFeed = dynamic(() => import('react-bell-chat').then(mod => mod.ChatFeed), {ssr: false})
const BubbleGroup = dynamic(() => import('react-bell-chat').then(mod => mod.BubbleGroup), {ssr: false})
const Avatar = dynamic(() => import('react-bell-chat').then(mod => mod.Avatar), {ssr: false})
const ChatBubble = dynamic(() => import('react-bell-chat').then(mod => mod.ChatBubble), {ssr: false})

const ChatApp = () => {
    const ids = ['5e2f6821e943b27a10009bbfdbe62893', 'bfe04d0f34f1239f15478f5ffccdc97a', '5eb3b5570d5af2ab83ad98dd45fcc09f']
    const getGravatarUrl = index => `https://gravatar.com/avatar/${ids[index % 3]}?s=200&d=robohash&r=x`

    const chat = useRef()
    const [
        {
            messageText,
            authors,
            currentUser,
            firstAuthorTimer,
            hasOldMessages,
            messages,
            secondAuthorTimer,
            showIsTyping,
            useCustomBubble,
            useAvatarBg,
            useCustomIsTyping,
            showMsgProgress,
        },
        setState,
    ] = useState({
        authors: [
            {
                id: 0,
                name: 'You',
                bgImageUrl: getGravatarUrl(0),
            },
            {
                id: 1,
                name: 'Mark',
                isTyping: false,
                lastSeenMessageId: 7,
                bgImageUrl: getGravatarUrl(1),
            },
            {
                id: 2,
                name: 'Evan',
                isTyping: false,
                lastSeenMessageId: 7,
                bgImageUrl: getGravatarUrl(2),
            },
        ],
        messages: [
            {
                id: 0,
                authorId: 1,
                message: 'Hey guys!!',
                createdOn: new Date(2018, 2, 27, 18, 32, 24),
                isSend: true,
            },
            {
                id: 1,
                authorId: 2,
                message: 'Hey! Evan here. react-bell-chat is pretty dooope.',
                createdOn: new Date(2018, 2, 28, 18, 12, 24),
                isSend: true,
            },
            {
                id: 2,
                authorId: 2,
                message: 'Rly is.',
                createdOn: new Date(2018, 2, 28, 18, 13, 24),
                isSend: true,
            },
            {
                id: 3,
                authorId: 2,
                message: 'Long group.',
                createdOn: new Date(2018, 2, 28, 18, 13, 24),
                isSend: true,
            },
            {
                id: 4,
                authorId: 0,
                message: 'My message.',
                createdOn: new Date(2018, 2, 29, 19, 32, 24),
                isSend: true,
            },
            {
                id: 5,
                authorId: 0,
                message: 'One more.',
                createdOn: new Date(2018, 2, 29, 19, 33, 24),
                isSend: true,
            },
            {
                id: 6,
                authorId: 2,
                message: 'One more group to see the scroll.',
                createdOn: new Date(2018, 2, 29, 19, 35, 24),
                isSend: true,
            },
            {
                id: 7,
                authorId: 2,
                message: 'I said group.',
                createdOn: new Date(2018, 2, 29, 19, 35, 24),
                isSend: true,
            },
        ],
        useCustomBubble: false,
        currentUser: 0,
        messageText: '',
        showIsTyping: true,
        hasOldMessages: true,
        firstAuthorTimer: undefined,
        secondAuthorTimer: undefined,
        useAvatarBg: true,
        useCustomIsTyping: true,
        showMsgProgress: false,
    })

    const customBubble = props => (
        <div className="mb-2">
            <span>{props.author && props.author.name + ' ' + (props.message.authorId !== props.yourAuthorId ? 'says' : 'said') + ': '}</span>
            <span className={props.classes?.text}>{props.message.message}</span>
        </div>
    )

    const loadingChatBubbleClasses = {
        text: 'loading--placeholder',
    }

    const messagesLoading = [
        {message: '██ ██ ██████ ██ █ ████ █', authorId: 0},
        {message: '████ ████ ██ ████', authorId: 1},
        {message: '██ ███ ██ ███ ██ ███', authorId: 2},
    ]

    function useClickHandler(propertyName, setState) {
        return useCallback(() => {
            setState(t => ({...t, [propertyName]: !t[propertyName]}))
        }, [propertyName])
    }

    const customIsTypingFactory =
        ({bubble}) =>
        props =>
            props.typingAuthors?.length > 0 && (
                <>
                    {props.typingAuthors.map(a => (
                        <BubbleGroup
                            key={a.id}
                            yourAuthorId={0}
                            author={a}
                            messages={a.isTypingMessage ? [{message: a.isTypingMessage + '...', authorId: a.id}] : [messagesLoading.find(m => m.authorId === a.id)]}
                            chatBubbleClasses={a.isTypingMessage ? undefined : loadingChatBubbleClasses}
                            CustomChatBubble={bubble ?? ChatBubble}
                            CustomAvatar={Avatar}
                            showRecipientAvatar={true}
                            chatBubbleStyles={chatBubbleStyles}
                            avatarStyles={avatarStyles}
                        />
                    ))}
                </>
            )

    const onPress = useCallback(user => {
        setState(prev => ({...prev, currentUser: user}))
    }, [])

    // const handleIsTyping = useCallback(authorId => {
    //     setState(prev => ({
    //         ...prev,
    //         authors: prev.authors.slice(0).map((a, i) => (i === authorId ? a : {...a, isTyping: !a.isTyping})),
    //     }))
    // }, [])

    const handleIsCurrentTyping = useCallback(() => {
        if (currentUser !== 0) {
            setState(prev => ({
                ...prev,
                authors: prev.authors.slice(0).map((a, i) => (i === currentUser ? a : {...a, isTyping: !a.isTyping})),
            }))
        }
    }, [currentUser])

    const handleIsTypingDebounced = useCallback(
        useDebouncedCallback(handleIsCurrentTyping, 700, {
            leading: true,
            trailing: true,
        }),
        [handleIsCurrentTyping]
    )

    const onMessageChange = useCallback(
        event => {
            const newMessage = event.target.value
            setState(prev => ({
                ...prev,
                messageText: newMessage,
                authors: showMsgProgress ? prev.authors.slice(0).map((a, i) => (i === currentUser ? a : {...a, isTypingMessage: newMessage})) : prev.authors,
            }))
            handleIsTypingDebounced()
            handleIsTypingDebounced()
        },
        [handleIsTypingDebounced, currentUser, showMsgProgress]
    )

    const onLoadOldMessages = useCallback(
        () =>
            new Promise(resolve =>
                setTimeout(() => {
                    setState(previousState => ({
                        ...previousState,
                        messages: new Array(10)
                            .fill(1)
                            .map((e, i) => ({
                                id: Number(new Date()),
                                createdOn: new Date(2017, 1, 1),
                                message: 'Old message ' + (i + 1).toString(),
                                authorId: Math.round(Math.random() + 1),
                            }))
                            .concat(previousState.messages),
                    }))
                    resolve()
                }, 1000)
            ),
        []
    )

    useEffect(() => {
        if (!showMsgProgress) {
            setState(prev => ({
                ...prev,
                authors: prev.authors.map(a => ({
                    ...a,
                    isTypingMessage: '',
                })),
            }))
        }
    }, [showMsgProgress])
    useEffect(() => chat.current?.scrollApi?.scrollToBottom?.(), [showIsTyping])
    useEffect(
        () =>
            setState(prev => ({
                ...prev,
                authors: prev.authors.map((a, i) => ({
                    ...a,
                    bgImageUrl: useAvatarBg ? getGravatarUrl(i) : undefined,
                })),
            })),
        [useAvatarBg]
    )

    const onUseAvatarBgClick = useClickHandler('useAvatarBg', setState)
    const onHasOldMessagesClick = useClickHandler('hasOldMessages', setState)

    const onSystemMessageClick = useCallback(() => {
        setState(prev => ({
            ...prev,
            messages: prev.messages.concat([
                {
                    id: Number(new Date()),
                    createdOn: new Date(),
                    message: 'System message',
                },
            ]),
        }))
    }, [])

    const onMessageSubmit = useCallback(
        event => {
            event.preventDefault()
            if (messageText !== '') {
                const id = Number(new Date())
                const newMessage = {
                    id,
                    authorId: currentUser,
                    message: messageText,
                    createdOn: new Date(),
                    isSend: false,
                }
                setState(previousState => ({
                    ...previousState,
                    messageText: '',
                    messages: previousState.messages.concat(newMessage),
                    authors: previousState.authors.slice(0).map((a, i) => (i === currentUser ? a : {...a, isTypingMessage: ''})),
                }))
                chat.current?.onMessageSend?.()
                setTimeout(() => {
                    setState(previousState => ({
                        ...previousState,
                        messages: previousState.messages.map(m => (m.id === id ? {...m, isSend: true} : m)),
                    }))
                }, 2000)
            }
            return true
        },
        [messageText, currentUser]
    )

    const CustomIsTyping = useMemo(
        () =>
            useCustomIsTyping
                ? customIsTypingFactory({
                      bubble: useCustomBubble ? customBubble : ChatBubble,
                      showRecipientAvatar: true,
                  })
                : undefined,
        [useCustomBubble, useCustomIsTyping, true]
    )

    return (
        <Container app="Chat">
            <div className="chatfeed-wrapper">
                <ChatFeed
                    ref={chat}
                    yourAuthorId={0}
                    messages={messages}
                    authors={authors}
                    style={style}
                    avatarStyles={avatarStyles}
                    chatBubbleStyles={chatBubbleStyles}
                    // maxHeight={350}
                    CustomChatBubble={useCustomBubble ? customBubble : undefined}
                    CustomIsTyping={CustomIsTyping}
                    showRecipientAvatar={true}
                    showIsTyping={showIsTyping}
                    showDateRow={true}
                    showLoadingMessages={true}
                    hasOldMessages={hasOldMessages}
                    onLoadOldMessages={onLoadOldMessages}
                />

                <form onSubmit={event => onMessageSubmit(event)}>
                    <input
                        placeholder="Type a message..."
                        className="message-input form-control bg-white rounded-pill mt-4"
                        value={messageText}
                        onChange={onMessageChange}
                    />
                </form>

                <div className="label mt-0 bt-0 mt-5">Authors:</div>
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <button role="button" style={{...styles.button, ...(currentUser === 0 ? styles.selected : {})}} onClick={() => onPress(0)}>
                        You
                    </button>
                    <button style={{...styles.button, ...(currentUser === 1 ? styles.selected : {})}} onClick={() => onPress(1)}>
                        Mark
                    </button>
                    <button style={{...styles.button, ...(currentUser === 2 ? styles.selected : {})}} onClick={() => onPress(2)}>
                        Evan
                    </button>
                </div>

                <div className="label">Simulate input:</div>

                <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 10}}>
                    <button style={{...styles.button}} onClick={onSystemMessageClick}>
                        System message
                    </button>
                </div>

                <div className="label">Switches:</div>

                <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 10}}>
                    <button style={{...styles.button, ...(useAvatarBg ? styles.selected : {})}} onClick={onUseAvatarBgClick}>
                        Avatars images
                    </button>
                    <button style={{...styles.button, ...(hasOldMessages ? styles.selected : {})}} onClick={onHasOldMessagesClick}>
                        Has more messages
                    </button>
                </div>
            </div>
        </Container>
    )
}

const styles = {
    button: {
        backgroundColor: '#fff',
        borderColor: '#1D2129',
        borderStyle: 'solid',
        borderRadius: 20,
        borderWidth: 2,
        color: '#1D2129',
        fontSize: 18,
        fontWeight: 300,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
    },
    selected: {
        color: '#fff',
        backgroundColor: '#0084FF',
        borderColor: '#0084FF',
    },
}

const style = {
    height: '80vh',
    backgroundColor: '#f2f2f2',
}

const chatBubbleStyles = {
    chatBubble: {
        boxShadow: 'rgb(187 187 187) 0px 0px 2px 0',
    },
    recipientChatBubble: {
        backgroundColor: 'white',
    },
    userChatBubble: {
        color: 'white',
        backgroundColor: 'rgb(0, 132, 255)',
    },
}

const avatarStyles = {
    container: {
        boxShadow: '#cacaca 0px 0px 20px 0px, rgb(187 187 187) 0px 0px 2px 0',
        backgroundColor: 'white',
        overflow: 'hidden',
    },
}

export default ChatApp
