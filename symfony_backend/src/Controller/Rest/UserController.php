<?php

// src/Controller/Rest/UserController.php
namespace App\Controller\Rest;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\UnitOfWork;
use Doctrine\DoctrineCollection;
use Symfony\Component\HttpFoundation\JsonResponse;


use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\View\View;
 
 
use Symfony\Component\HttpFoundation\Request;
 
use App\Entity\User;
use App\Entity\Shift;
use App\Specific;

class UserController extends FOSRestController
{
     /**
	 //hmm: symfony hides routes in the /comments/
     * Retrieves a User resource
     * @Rest\Get("/user")
     * @return JSON
     * @throws \Doctrine\ORM\EntityNotFoundException
     */
    public function list()
    {
		//things that didn't work (still learning symfony!!):
		//$entities = User::findAll();
		//$entities = $em->getRepository("Entities\User")->findAll();
		//$entities = new Doctrine_Collection('User');
		
		//this works, but the repository code sure is ugly. i figured out how to sort!!
		$entities = $this->getDoctrine()->getRepository(User::class)->findBy(array(), array('name' => 'ASC'));
		
		//i'd rather use something like this:
		//$entities = User::getAll();
        return View::create($entities, Response::HTTP_OK);
    }
	
	 /**
     * Replaces User resource
	 * @Route("/user/save/{id}", methods="PUT")
     */
	 //you will need Allow-Control-Allow-Origin: 
	 //https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en-US
	 //to test across domains
    public function putUser(int $id, Request $request): View
    {	
		//comment out the next line to get PUT to work:
		return View::create(array('error'=>Specific::DISABLED_BY_REQUIREMENT, 'oode'=>Specific::DISABLED_CODE), Response::HTTP_OK);
		
		//there's a better way involving DTOs etc that i don't have time to figure out today!
		$name =  $request->request->get('name');
		$email =  $request->request->get('email');
		$phone =  $request->request->get('phone');
		$role =  $request->request->get('role');
		if(is_null($role)) {
			$role = "employee";
		}
		$entityManager = $this->getDoctrine()->getManager();
		
		$entity = $this->getDoctrine()->getRepository(User::class)->find($id);
		$entity->setName($name);
		$entity->setEmail($email);
		$entity->setPhone($phone);
		$entity->setRole($role);
		
		//dont change created_at on a put!
		//$entity->setCreatedAt(new \DateTime());
		$entity->setUpdatedAt(new \DateTime());
		
		$entityManager->persist($entity);
		$entityManager->flush();
        // If PUT returns a 200 HTTP OK response with the entity
        return View::create($entity, Response::HTTP_OK);
    }
	
	 /**
     * Login User
	 * @Route("/user/login", methods="POST")
     */
	 //you will need Allow-Control-Allow-Origin: 
	 //https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en-US
	 //to test across domains
    public function loginUser(Request $request): View
	{
		$email =  $request->request->get('email');
		$password =  sha1($request->request->get('password'));
		$existingEmailEntities = $this->getDoctrine()->getRepository(User::class)->findBy(array("email"=>$email));
		if(is_array($existingEmailEntities) && count($existingEmailEntities) >0) {
			$existingEmailEntity = $existingEmailEntities[0];
			if(!$existingEmailEntity) {
				return View::create(array("error"=>"That email does not exist", "code"=>199), Response::HTTP_OK);
			} else {
				//a better system would be working from an encrypted password but that's another headache
				//echo($existingEmailEntity->getPassword() . "+" . $password);
				if($existingEmailEntity->getPassword()  != $password) {
					return View::create(array("error"=>"The password is wrong for this user.", "code"=>204), Response::HTTP_OK);
				} else {
					return View::create(array("code"=>200, "user"=>$existingEmailEntity), Response::HTTP_OK);
				}
			}
		} else {
			return View::create(array("error"=>"That email does not exist","code"=>198), Response::HTTP_OK);
		}
	}
	
	 /**
     * Create User resource
	 * @Route("/user/create", methods="POST")
     */
	 //you will need Allow-Control-Allow-Origin: 
	 //https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en-US
	 //to test across domains
    public function postUser(Request $request): View
    {	
		//comment out the next line to get POST to work:
		return View::create(array('error'=>Specific::DISABLED_BY_REQUIREMENT, 'oode'=>Specific::DISABLED_CODE), Response::HTTP_OK);
	
		//there's a better way involving DTOs etc that i don't have time to figure out today!
		$name =  $request->request->get('name');
		$email =  $request->request->get('email');
		$password =  $request->request->get('password');
		$phone =  $request->request->get('phone');
		$role =  $request->request->get('role');
		
		//make sure we don't get dupes from re-submitting a new user form
		$existingEmailEntity = $this->getDoctrine()->getRepository(User::class)->findBy(array("email"=>$email));
		$existingPhoneEntity = $this->getDoctrine()->getRepository(User::class)->findBy(array("phone"=>$phone));
		//exception throwing messed everything up on the React side, so i'm returning errors differently
		if($existingEmailEntity && $existingPhoneEntity) {
			//throw new \LogicException('A user with the email ' . $email . ' and the phone number ' . $phone . ' already exists.');
			return View::create(array("error"=>'A user with the email ' . $email . ' and the phone number ' . $phone . ' already exists.', "code"=>201), Response::HTTP_OK);
		}
		if($existingEmailEntity) {
			//throw new \LogicException('A user with the email ' . $email . ' already exists.');
			return View::create(array("error"=>'A user with the email ' . $email . ' already exists.', "code"=>202), Response::HTTP_OK);
		}
		if($existingPhoneEntity) {
			//throw new \LogicException('A user with the phone ' . $phone . ' already exists.');
			return View::create(array("error"=>'A user with the phone ' . $phone . ' already exists.', "code"=>203), Response::HTTP_OK);
		}
		if(is_null($phone) && is_null($email)) {
			//throw new \LogicException('Every user must have at least a phone number or an email.');
			return View::create(array("error"=>'Every user must have at least a phone number or an email.', "code"=>204), Response::HTTP_OK);
		}
		if(is_null($role)) {
			$role = "employee";
		}

		$entityManager = $this->getDoctrine()->getManager();
		$entity = new User();
		$entity->setName($name);
		$entity->setEmail($email);
		$entity->setPhone($phone);
		$entity->setRole($role);
		$entity->setPassword($password);
		$entity->setCreatedAt(new \DateTime());
		$entity->setUpdatedAt(new \DateTime());
		$entityManager->persist($entity);
		$entityManager->flush();
        // If POST returns a 200 HTTP OK response with the entity
        return View::create(array("user"=>$entity, "code"=>200), Response::HTTP_OK);
    }

     /**
	 //hmm: symfony hides routes in the /comments/
     * Retrieves a User resource
     * @Rest\Get("/user/{id}")
     * @param int $userId
     * @return JSON
     * @throws \Doctrine\ORM\EntityNotFoundException
     */
    public function get(string $id)
    {
		$entity = $this->getDoctrine()->getRepository(User::class)->find($id);
		//how i want to do things:
		//return new JsonResponse($entity);
		//how i must do things:
		return View::create($entity, Response::HTTP_OK);
    }
  
     /**
	 //hmm: symfony hides routes in the /comments/
     * Retrieves a shifts for a user
     * @Rest\Get("/usershifts/{id}")
     * @param int $userId
     * @return JSON
     * @throws \Doctrine\ORM\EntityNotFoundException
     */
    public function getUserShifts(string $id)
    {
		$user = $this->getDoctrine()->getRepository(User::class)->find($id);
		$fkOfInterest = 'employeeId';
		//if we're an employee, we only care about our shifts
		$searchArray = array($fkOfInterest=>$id);
		if($user->getRole() == 'manager') {
			$fkOfInterest = 'managerId';
			//if we're a manager, we care about all shifts
			$searchArray = array();
		}
		$entities = $this->getDoctrine()->getRepository(Shift::class)->findBy($searchArray, array('startTime' => 'ASC'));
 
		if($user->getRole() == 'manager') {
			foreach($entities as &$entity) {
				$employeeId = $entity->getEmployeeId();
				if($employeeId) {
					$employee = $this->getDoctrine()->getRepository(User::class)->find($employeeId);
					$entity->employee = $employee;
				}
			}
		}
		//how i want to do things:
		//return new JsonResponse($entity);
		//how i must do things:
		return View::create($entities, Response::HTTP_OK);
    }

     /**
	 //hmm: symfony hides routes in the /comments/
     * Retrieves a breakdown of hours allocated to a user by week
     * @Rest\Get("user/weeklysummary/{id}")
     * @param int $userId
     * @return JSON
     * @throws \Doctrine\ORM\EntityNotFoundException
     */
    public function weeklySummary(string $id)
    {
		//these next two lines were deeply non-intuitive and hard to track down
		$em = $this->getDoctrine()->getManager();
		$connection = $em->getConnection();
		//i'll just do this in parameterized SQL so as not to go insane
		//I've noticed that UNIXTIMESTAMPDIFF doesn't work on some servers do i just subtract the seconds
		$sql = "
		SELECT YEAR(start_time) AS year,
		WEEK(start_time) AS week, 
		SUM((UNIX_TIMESTAMP(end_time) - UNIX_TIMESTAMP(start_time))/3600) AS total_hours
		FROM shift WHERE employee_id = :id
		GROUP BY CONCAT(YEAR(start_time), '/', WEEK(start_time))
		ORDER BY CONCAT(YEAR(start_time), '/', WEEK(start_time)) ASC
		";
		$statement = $connection->prepare($sql);
		$statement->bindValue('id', $id);
		$statement->execute();
		$results = $statement->fetchAll();
		return View::create($results, Response::HTTP_OK);
	}
}