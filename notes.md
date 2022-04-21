# Notes

- `Outlet` is synonimous with `children` in React
- `dynamic` routes are made with `$` in the file name

## Supabase

- auto generated api docs are super cool
- Able to only fetch the fields we want, stops over fetching like gql
- To enable realtime, in the supabase dashboard click **datasbase -> replicatio** and chose the table to listen to events from

## Remix

- env vars can be passed frm server to browser by using a loader. Seeing the loader in the root file and the supabase.ts for an example
- `action` from writing data, helps refreshing data, and managing defaults (`e.preventDefault` etc)
- When an action is called it will call the associated loaders once it is complete. This updates the data o nthe screen
- Set up tailwind - https://tailwindcss.com/docs/guides/remix
