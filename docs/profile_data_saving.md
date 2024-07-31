## The broadcaster

You can only pass callbacks down through components not up so the profile-card instead passes a broadcaster you can connect callbacks to. It might be a good idea to use context or something to pass it, but right now you just pass it manually to each component in profile-card.

```typescript
delcare class SaveBroadcaster {
	connect(callback: () => Promise<any>): void
	disconnect(callback: () => Promise<any>): void
}
```

## Usage

The connected function needs to return a promise which should just be your fetch. This should be wrapped in a `useEffect` to only connect the callback when the component is mounted, and it needs to be cleaned up with `disconnect` call passing the same callback which was connected.

```javascript
// Example component
function ExampleComponent({broadcaster}) {
	const [myState, setMyState] = useState()

	useEffect(() => {
		const cb = () => backend.put("something")
		broadcaster.connect(cb)
		return () => broadcaster.disconnect(cb)
	}, [])
}
```
