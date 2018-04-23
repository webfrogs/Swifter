#!/bin/sh
set -e

case "$(uname -s)" in
	Darwin)
		;;
	*)
		echo "Only support macOS for now."
		exit 1
esac

checkInstall() {
    checkedCmd="$1"
    if test -x "$(command -v ${checkedCmd})"; then
        echo "${checkedCmd} is found."
    else
        echo "Cannot find ${checkedCmd}."
        exit 1
    fi

}

checkInstall 'git'
checkInstall 'swift'
echo ""

# TODO: check swift version, only support swift version newer than 4.1

TEMP_FOLDER_PATH="/tmp/swift-nest"
if [ -d "${TEMP_FOLDER_PATH}" ]; then
    rm -rf "${TEMP_FOLDER_PATH}" 
fi
mkdir "${TEMP_FOLDER_PATH}"
cd "${TEMP_FOLDER_PATH}"

git clone https://github.com/webfrogs/SwiftNest.git
cd SwiftNest
echo "Start to fetch libraries then build SwiftNest..."
make install

cd ..
rm -rf "${TEMP_FOLDER_PATH}"


