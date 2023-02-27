#!/bin/bash
function log() {
    log_level="$1"
    log_message="$2"
    log_full="[$(date '+%Y-%m-%d %H:%M:%S')] [$log_level] Agent - $log_message"
    echo "$log_full"
}

function log_info() {
    log 'INFO' "$@"
}

function log_error() {
    log 'ERROR' "$@"
}

function log_warn() {
    log 'WARN' "$@"
}

function log_debug() {
    log 'DEBUG' "$@"
}

function log_trace() {
    log 'TRACE' "$@"
}

version_number=$(cat ./package.json | grep version | awk -F '"' '{print $4}')
app_name=$(cat ./package.json | grep name | awk -F '"' '{print $4}')

function intall_depth() {
    log_info "Installing depth..."
    npm install -g pnpm
    pnpm install
    if [ $? -ne 0 ]; then
        log_error "Installing depth failed"
        exit 1
    fi
    log_info "Installing depth...done"
}

function build_agent() {
    log_info "Building agent..."
    pnpm run prebuild
    pnpm run build:prod
    if [ $? -ne 0 ]; then
        log_error "Building agent failed"
        exit 1
    fi
    pnpm run pkg
    if [ $? -ne 0 ]; then
        log_error "Building agent pkg failed"
        exit 1
    fi
    log_info "Building agent...done"
}

function mkdir_produce() {
    log_info "Creating dist folder..."

    mkdir -p "punkAgent_${version_number}"
    if [ $? -ne 0 ]; then
        log_error "Creating dist folder failed"
        exit 1
    fi
    mkdir -p "punkAgent_${version_number}"/tools/shells
    if [ $? -ne 0 ]; then
        log_error "Creating dist folder failed"
        exit 1
    fi
    log_info "Creating dist folder...done"
}

# 替换配置文件中的版本号和应用名
function app_config_YAML_modify() {
    log_info "Modifying app config YAML..."
    sed -i "s/version\:/version\: ${version_number}/g" ./punkAgent_"${version_number}"/config.yml
    sed -i "s/name\:/name\: ${app_name}/g" ./punkAgent_"${version_number}"/config.yml
    if [ $? -ne 0 ]; then
        log_error "Modifying app config YAML failed"
        exit 1
    fi
    log_info "Modifying app config YAML...done"
}

function mv_files() {
    log_info "Moving files..."
    cp ./bundles/agent-boot ./punkAgent_"${version_number}"
    cp ./config.yml ./punkAgent_"${version_number}"
    cp -r ./bin ./punkAgent_"${version_number}"
    cp -r ./shells/ ./punkAgent_"${version_number}"/tools/shells
    if [ $? -ne 0 ]; then
        log_error "Moving files failed"
        exit 1
    fi
    log_info "Moving files...done"
}

function mod_file() {
    log_info "Modifying files..."
    chmod 500 ./punkAgent_"${version_number}"/agent-boot
    chmod 500 -R ./punkAgent_"${version_number}"/tools/shells
    chmod 500 -R ./punkAgent_"${version_number}"/bin
    chmod 500 ./punkAgent_"${version_number}"/config.yml
    if [ $? -ne 0 ]; then
        log_error "Modifying files failed"
        exit 1
    fi
    log_info "Modifying files...done"
}

function tarZIP() {
    log_info "Taring files..."
    tar -zcvf "PunkAgent_${version_number}.tar.gz" "punkAgent_${version_number}"
    if [ $? -ne 0 ]; then
        log_error "Taring files failed"
        exit 1
    fi
    echo "PunkAgent_${version_number}.tar.gz" >./tar_file_result.txt
    log_info "Taring files...done"
}

function main() {
    intall_depth
    build_agent
    mkdir_produce
    mv_files
    app_config_YAML_modify
    mod_file
    tarZIP
}

main "$@"
