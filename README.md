# Install
```
npm install -g @takumus/tslib-cli
```
# How to create/edit project
You can create/edit your project in current directry.
```
tslib-cli
```
You can also choose your project name and create/edit directory.
```
tslib-cli project-name
```
### project name
It becomes your project directory name as a default.  
You can use scopes in package names.  
### global name of `browser`
Default value is `its project name` in camel-case.
### destination directory
`./dist` is default value.
### entry .ts file
`./src/index.ts` is default value.
### export `cjs` with node_modules?
`no` is default value.
### export `esm` with node_modules?
`no` is default value.
### export `browser` with node_modules?
`yes` is default value.
### package.json author.name
SSIA
### package.json author.email
SSIA

# Build
```
npm run build
```
