from setuptools import setup, find_packages

with open('requirements.txt') as f:
    requirements = f.read().splitlines()

setup(
    name='posts-service',
    version='1.0.1',
    packages=find_packages(),
    install_requires=requirements,
    description='The posts service for xpose and performs image processing on the images uploaded by the users.'
)
